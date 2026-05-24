"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import {
	CopyPlus,
	Eye,
	Filter,
	PenSquare,
	Plus,
	ShieldCheck,
	ShieldX,
	Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Badge,
    Button,
    Combobox,
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DropdownMenuDangerItem,
    DropdownMenuInfoItem, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSuccessItem,
    DropdownMenuWarningItem,
    Label,
    NoContentState,
    NotFoundState,
    PageShell,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SomeErrorState,
    toast,
} from "@/components";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/account/utils";
import { StaffEditorDrawer } from "@/features/partner/staff/StaffEditorDrawer";
import {
	useRemoveStaffMutation,
	useSetStaffActiveMutation,
} from "@/features/partner/staff/mutations";
import {
	useLinkedStaffAccountQuery,
	useLinkedStaffUserQuery,
	useStaffCitiesQuery,
	useStaffDetailQuery,
	useStaffEntitiesQuery,
	useStaffQuery,
} from "@/features/partner/staff/queries";
import {
	buildStaffCityOptions,
	buildStaffEntityOptions,
	createStaffColumns,
	filterStaff,
	getLinkedStaffAccountErrorToastContent,
	getLinkedStaffUserErrorToastContent,
	getStaffActiveOptionClassName,
	getStaffCitiesErrorToastContent,
	getStaffDeleteErrorToastContent,
	getStaffDetailErrorToastContent,
	getStaffEmptyStateCopy,
	getStaffEntitiesErrorToastContent,
	getStaffFilterSummary,
	getStaffListErrorToastContent,
	getStaffSetActiveErrorToastContent,
	resolveStaffCityLabel,
} from "@/features/partner/staff/utils";
import {
	ServicePageHeader,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { AccountResponse, StaffResponse } from "@/types/api";
import type {
	StaffActiveFilter,
	StaffEditorMode,
} from "@/types/client/partner";
import { WebApiError } from "@/utils/web-api";

export function StaffPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [draftEntityIdFilter, setDraftEntityIdFilter] = useState("");
	const [draftCityIdFilter, setDraftCityIdFilter] = useState("");
	const [draftActiveFilter, setDraftActiveFilter] =
		useState<StaffActiveFilter>("");
	const [entityIdFilter, setEntityIdFilter] = useState("");
	const [cityIdFilter, setCityIdFilter] = useState("");
	const [activeFilter, setActiveFilter] = useState<StaffActiveFilter>("");
	const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
	const [editorState, setEditorState] = useState<{
		id: string | null;
		mode: StaffEditorMode;
	} | null>(null);
	const [pendingStatusStaff, setPendingStatusStaff] = useState<{
		active: boolean;
		staff: StaffResponse;
	} | null>(null);
	const [pendingDeleteStaff, setPendingDeleteStaff] =
		useState<StaffResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const staffQuery = useStaffQuery();
	const staffCitiesQuery = useStaffCitiesQuery();
	const staffEntitiesQuery = useStaffEntitiesQuery();
	const staffDetailQuery = useStaffDetailQuery(selectedStaffId);
	const linkedAccountQuery = useLinkedStaffAccountQuery(
		staffDetailQuery.data?.accountId ?? null,
	);
	const linkedUserQuery = useLinkedStaffUserQuery(
		staffDetailQuery.data?.userId ?? null,
	);
	const listErrorToastAtRef = useRef(0);
	const detailErrorToastAtRef = useRef(0);
	const linkedAccountErrorToastAtRef = useRef(0);
	const linkedUserErrorToastAtRef = useRef(0);
	const citiesErrorToastAtRef = useRef(0);
	const entitiesErrorToastAtRef = useRef(0);
	const deleteTimersRef = useRef(
		new Map<string, ReturnType<typeof setTimeout>>(),
	);
	const setStaffActiveMutation = useSetStaffActiveMutation();
	const removeStaffMutation = useRemoveStaffMutation();
	const allStaff = useMemo(() => staffQuery.data ?? [], [staffQuery.data]);
	const allCities = useMemo(
		() => staffCitiesQuery.data ?? [],
		[staffCitiesQuery.data],
	);
	const allEntities = useMemo(
		() => staffEntitiesQuery.data ?? [],
		[staffEntitiesQuery.data],
	);
	const cityById = useMemo(
		() => new Map(allCities.map(city => [city.id, city])),
		[allCities],
	);
	const entityById = useMemo(
		() => new Map(allEntities.map(entity => [entity.id, entity])),
		[allEntities],
	);
	const cityOptions = useMemo(
		() => buildStaffCityOptions(allCities),
		[allCities],
	);
	const entityOptions = useMemo(
		() => buildStaffEntityOptions(allEntities),
		[allEntities],
	);
	const filteredStaff = useMemo(
		() =>
			filterStaff(allStaff, {
				query: deferredQuerySearch,
				entityIdFilter,
				cityIdFilter,
				activeFilter,
			}),
		[activeFilter, allStaff, cityIdFilter, deferredQuerySearch, entityIdFilter],
	);
	const columns = useMemo(() => createStaffColumns(t), [t]);
	const selectedStaff = staffDetailQuery.data;
	const hasSecondaryFilters = Boolean(
		entityIdFilter || cityIdFilter || activeFilter,
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasSecondaryFilters);
	const filterSummary = useMemo(
		() =>
			getStaffFilterSummary(t, {
				query: deferredQuerySearch,
				entityIdFilter,
				cityIdFilter,
				activeFilter,
				entityById,
				cityById,
			}),
		[
			activeFilter,
			cityById,
			cityIdFilter,
			deferredQuerySearch,
			entityById,
			entityIdFilter,
			t,
		],
	);
	const emptyStateCopy = useMemo(
		() => getStaffEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (staffQuery.isError) {
			return (
				<SomeErrorState
					title={t("partner.staffPage.table.error.title")}
					description={t("partner.staffPage.table.error.description")}
					onRefresh={() => {
						void staffQuery.refetch();
					}}
				/>
			);
		}

		return (
			<NoContentState
				title={emptyStateCopy.title}
				description={emptyStateCopy.description}
			/>
		);
	}, [emptyStateCopy.description, emptyStateCopy.title, staffQuery, t]);

	useEffect(() => {
		if (!staffQuery.isError || staffQuery.errorUpdatedAt === 0) {
			return;
		}

		if (listErrorToastAtRef.current === staffQuery.errorUpdatedAt) {
			return;
		}

		listErrorToastAtRef.current = staffQuery.errorUpdatedAt;
		const { title, description } = getStaffListErrorToastContent(
			t,
			staffQuery.error,
		);
		toast.danger(title, { description });
	}, [staffQuery.error, staffQuery.errorUpdatedAt, staffQuery.isError, t]);

	useEffect(() => {
		if (!staffDetailQuery.isError || staffDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === staffDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = staffDetailQuery.errorUpdatedAt;
		const { title, description } = getStaffDetailErrorToastContent(
			t,
			staffDetailQuery.error,
		);
		toast.danger(title, { description });
	}, [
		staffDetailQuery.error,
		staffDetailQuery.errorUpdatedAt,
		staffDetailQuery.isError,
		t,
	]);

	useEffect(() => {
		if (
			!linkedAccountQuery.isError ||
			linkedAccountQuery.errorUpdatedAt === 0
		) {
			return;
		}

		if (
			linkedAccountErrorToastAtRef.current === linkedAccountQuery.errorUpdatedAt
		) {
			return;
		}

		linkedAccountErrorToastAtRef.current = linkedAccountQuery.errorUpdatedAt;
		const { title, description } = getLinkedStaffAccountErrorToastContent(
			t,
			linkedAccountQuery.error,
		);
		toast.danger(title, { description });
	}, [
		linkedAccountQuery.error,
		linkedAccountQuery.errorUpdatedAt,
		linkedAccountQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!linkedUserQuery.isError || linkedUserQuery.errorUpdatedAt === 0) {
			return;
		}

		if (linkedUserErrorToastAtRef.current === linkedUserQuery.errorUpdatedAt) {
			return;
		}

		linkedUserErrorToastAtRef.current = linkedUserQuery.errorUpdatedAt;
		const { title, description } = getLinkedStaffUserErrorToastContent(
			t,
			linkedUserQuery.error,
		);
		toast.danger(title, { description });
	}, [
		linkedUserQuery.error,
		linkedUserQuery.errorUpdatedAt,
		linkedUserQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!staffCitiesQuery.isError || staffCitiesQuery.errorUpdatedAt === 0) {
			return;
		}

		if (citiesErrorToastAtRef.current === staffCitiesQuery.errorUpdatedAt) {
			return;
		}

		citiesErrorToastAtRef.current = staffCitiesQuery.errorUpdatedAt;
		const { title, description } = getStaffCitiesErrorToastContent(
			t,
			staffCitiesQuery.error,
		);
		toast.danger(title, { description });
	}, [
		staffCitiesQuery.error,
		staffCitiesQuery.errorUpdatedAt,
		staffCitiesQuery.isError,
		t,
	]);

	useEffect(() => {
		if (
			!staffEntitiesQuery.isError ||
			staffEntitiesQuery.errorUpdatedAt === 0
		) {
			return;
		}

		if (entitiesErrorToastAtRef.current === staffEntitiesQuery.errorUpdatedAt) {
			return;
		}

		entitiesErrorToastAtRef.current = staffEntitiesQuery.errorUpdatedAt;
		const { title, description } = getStaffEntitiesErrorToastContent(
			t,
			staffEntitiesQuery.error,
		);
		toast.danger(title, { description });
	}, [
		staffEntitiesQuery.error,
		staffEntitiesQuery.errorUpdatedAt,
		staffEntitiesQuery.isError,
		t,
	]);

	useEffect(() => {
		const deleteTimers = deleteTimersRef.current;

		return () => {
			for (const timeoutId of deleteTimers.values()) {
				clearTimeout(timeoutId);
			}

			deleteTimers.clear();
		};
	}, []);

	function applySecondaryFilters() {
		setEntityIdFilter(draftEntityIdFilter);
		setCityIdFilter(draftCityIdFilter);
		setActiveFilter(draftActiveFilter);
		setFiltersOpen(false);
	}

	function clearAllFilters() {
		setQuerySearch("");
		setDraftEntityIdFilter("");
		setDraftCityIdFilter("");
		setDraftActiveFilter("");
		setEntityIdFilter("");
		setCityIdFilter("");
		setActiveFilter("");
		setFiltersOpen(false);
	}

	function handleStatusChangeConfirm() {
		if (!pendingStatusStaff) {
			return;
		}

		const { active, staff } = pendingStatusStaff;

		setStaffActiveMutation.mutate(
			{
				id: staff.accountId,
				active,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							active
								? "partner.staffPage.reactivate.feedback.success.title"
								: "partner.staffPage.deactivate.feedback.success.title",
						),
						{
							description: t(
								active
									? "partner.staffPage.reactivate.feedback.success.description"
									: "partner.staffPage.deactivate.feedback.success.description",
								{
									name: staff.userName,
								},
							),
						},
					);
					setPendingStatusStaff(null);
				},
				onError: error => {
					const { title, description } = getStaffSetActiveErrorToastContent(
						t,
						error,
						active,
					);
					toast.danger(title, { description });
					setPendingStatusStaff(null);
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteStaff) {
			return;
		}

		const staff = pendingDeleteStaff;
		const existingTimer = deleteTimersRef.current.get(staff.accountId);

		if (existingTimer) {
			clearTimeout(existingTimer);
		}

		const timeoutId = setTimeout(() => {
			deleteTimersRef.current.delete(staff.accountId);
			removeStaffMutation.mutate(
				{
					accountId: staff.accountId,
					userId: staff.userId,
				},
				{
					onSuccess: () => {
						toast.success(
							t("partner.staffPage.delete.feedback.success.title"),
							{
								description: t(
									"partner.staffPage.delete.feedback.success.description",
									{
										name: staff.userName,
									},
								),
							},
						);

						if (selectedStaffId === staff.accountId) {
							setSelectedStaffId(null);
						}

						if (editorState?.id === staff.accountId) {
							setEditorState(null);
						}
					},
					onError: error => {
						const { title, description } = getStaffDeleteErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
		}, 5000);

		deleteTimersRef.current.set(staff.accountId, timeoutId);
		setPendingDeleteStaff(null);

		toast.undo(t("partner.staffPage.delete.undo.title"), {
			description: t("partner.staffPage.delete.undo.description", {
				name: staff.userName,
			}),
			undoLabel: t("partner.staffPage.delete.undo.action"),
			duration: 5000,
			onUndo: () => {
				const scheduledTimeout = deleteTimersRef.current.get(staff.accountId);

				if (scheduledTimeout) {
					clearTimeout(scheduledTimeout);
					deleteTimersRef.current.delete(staff.accountId);
				}
			},
		});
	}

	function openEditorFromRow(id: string, mode: StaffEditorMode) {
		window.setTimeout(() => {
			setEditorState({ id, mode });
		}, 0);
	}

	return (
		<PageShell
			width="wide"
			className="grid h-[calc(100dvh-4.5rem)] min-h-[48rem] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden p-4 lg:p-6"
		>
			<ServicePageHeader
				title={t("partner.staffPage.title")}
				description={t("partner.staffPage.description")}
				metadata={{
					triggerLabel: t("partner.staffPage.metadata.trigger"),
					emptyTitle: t("partner.staffPage.metadata.empty.title"),
					emptyDescription: t("partner.staffPage.metadata.empty.description"),
				}}
				actions={
					<>
						{hasAnyFilters ? (
							<Button
								variant="secondary"
								onClick={clearAllFilters}
							>
								{t("partner.staffPage.filters.clear")}
							</Button>
						) : null}
						<Button
							leadingIcon={<Plus className="h-4 w-4" />}
							onClick={() => setEditorState({ id: null, mode: "create" })}
						>
							{t("partner.staffPage.create.open")}
						</Button>
					</>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("partner.staffPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("partner.staffPage.filters.search.placeholder")}
				/>

				<Drawer
					open={filtersOpen}
					onOpenChange={setFiltersOpen}
				>
					<div className="grid gap-2 self-end">
						<Label>{t("partner.staffPage.filters.drawer.label")}</Label>
						<Button
							variant="secondary"
							usage={hasSecondaryFilters ? "info" : "secondary"}
							className="w-full justify-start lg:min-w-56"
							onClick={() => setFiltersOpen(true)}
						>
							{hasSecondaryFilters
								? t("partner.staffPage.filters.drawer.active")
								: t("partner.staffPage.filters.drawer.trigger")}
						</Button>
					</div>
					<DrawerContent>
						<DrawerHeader
							overhead={t("partner.staffPage.filters.drawer.overhead")}
						>
							<DrawerTitle>
								{t("partner.staffPage.filters.drawer.title")}
							</DrawerTitle>
						</DrawerHeader>
						<DrawerBody className="grid gap-6">
							{staffEntitiesQuery.isError ? (
								<SomeErrorState
									title={t("partner.staffPage.filters.entity.error.title")}
									description={t(
										"partner.staffPage.filters.entity.error.description",
									)}
									onRefresh={() => {
										void staffEntitiesQuery.refetch();
									}}
								/>
							) : (
								<div className="grid gap-2">
									<Label>{t("partner.staffPage.filters.entity.label")}</Label>
									<Combobox
										options={entityOptions}
										value={draftEntityIdFilter}
										onValueChange={setDraftEntityIdFilter}
										placeholder={t(
											"partner.staffPage.filters.entity.placeholder",
										)}
										searchPlaceholder={t(
											"partner.staffPage.filters.entity.searchPlaceholder",
										)}
										emptyMessage={t(
											"partner.staffPage.filters.entity.emptyMessage",
										)}
										disabled={staffEntitiesQuery.isLoading}
									/>
								</div>
							)}

							{staffCitiesQuery.isError ? (
								<SomeErrorState
									title={t("partner.staffPage.filters.city.error.title")}
									description={t(
										"partner.staffPage.filters.city.error.description",
									)}
									onRefresh={() => {
										void staffCitiesQuery.refetch();
									}}
								/>
							) : (
								<div className="grid gap-2">
									<Label>{t("partner.staffPage.filters.city.label")}</Label>
									<Combobox
										options={cityOptions}
										value={draftCityIdFilter}
										onValueChange={setDraftCityIdFilter}
										placeholder={t(
											"partner.staffPage.filters.city.placeholder",
										)}
										searchPlaceholder={t(
											"partner.staffPage.filters.city.searchPlaceholder",
										)}
										emptyMessage={t(
											"partner.staffPage.filters.city.emptyMessage",
										)}
										disabled={staffCitiesQuery.isLoading}
									/>
								</div>
							)}

							<div className="grid gap-2">
								<Label>{t("partner.staffPage.filters.active.label")}</Label>
								<Select
									value={draftActiveFilter || "ALL"}
									onValueChange={value =>
										setDraftActiveFilter(
											value === "ALL" ? "" : (value as StaffActiveFilter),
										)
									}
								>
									<SelectTrigger
										className="w-full"
										placeholder={t(
											"partner.staffPage.filters.active.placeholder",
										)}
									/>
									<SelectContent>
										<SelectItem value="ALL">
											{t("partner.staffPage.filters.active.options.all")}
										</SelectItem>
										<SelectItem
											value="true"
											className={getStaffActiveOptionClassName("true")}
										>
											{t("partner.staffPage.filters.active.options.active")}
										</SelectItem>
										<SelectItem
											value="false"
											className={getStaffActiveOptionClassName("false")}
										>
											{t("partner.staffPage.filters.active.options.inactive")}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</DrawerBody>
						<DrawerFooter
							clearConfirmTitle={t(
								"partner.staffPage.filters.drawer.clearConfirm.title",
							)}
							clearConfirmDescription={t(
								"partner.staffPage.filters.drawer.clearConfirm.description",
							)}
							clearLabel={t("partner.staffPage.filters.clear")}
							actionLabel={t("partner.staffPage.filters.drawer.apply")}
							actionIcon={Filter}
							onClear={clearAllFilters}
							onAction={applySecondaryFilters}
						/>
					</DrawerContent>
				</Drawer>
			</ServicePageHeader>

			<ServicePageTableSection<StaffResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredStaff,
					emptyState: tableEmptyState,
					getRowActions: row => {
						const isActive = row.accountActive;

						return (
							<>
								<DropdownMenuInfoItem
									icon={Eye}
									label={t("partner.staffPage.table.actions.viewDetails")}
									onClick={() => setSelectedStaffId(row.accountId)}
								/>
								<DropdownMenuItem
									icon={PenSquare}
									label={t("partner.staffPage.table.actions.update")}
									onClick={() => openEditorFromRow(row.accountId, "update")}
								/>
								<DropdownMenuItem
									icon={CopyPlus}
									label={t("partner.staffPage.table.actions.duplicate")}
									onClick={() => openEditorFromRow(row.accountId, "duplicate")}
								/>
								<DropdownMenuSeparator />
								{isActive ? (
									<DropdownMenuWarningItem
										icon={ShieldX}
										label={t("partner.staffPage.table.actions.deactivate")}
										onClick={() =>
											setPendingStatusStaff({ active: false, staff: row })
										}
									/>
								) : (
									<DropdownMenuSuccessItem
										icon={ShieldCheck}
										label={t("partner.staffPage.table.actions.reactivate")}
										onClick={() =>
											setPendingStatusStaff({ active: true, staff: row })
										}
									/>
								)}
								<DropdownMenuDangerItem
									icon={Trash2}
									label={t("partner.staffPage.table.actions.delete")}
									onClick={() => setPendingDeleteStaff(row)}
								/>
							</>
						);
					},
					isLoading: staffQuery.isLoading,
					loadingLabel: t("partner.staffPage.loading.list"),
				}}
			/>

			<StaffEditorDrawer
				staffId={editorState?.id ?? null}
				mode={editorState?.mode ?? "update"}
				open={editorState !== null}
				onOpenChange={open => {
					if (!open) {
						setEditorState(null);
					}
				}}
			/>

			<Dialog
				open={selectedStaffId !== null}
				onOpenChange={open => {
					if (!open) {
						setSelectedStaffId(null);
					}
				}}
				isLoading={staffDetailQuery.isLoading}
				loadingLabel={t("partner.staffPage.loading.detail")}
			>
				<DialogContent>
					<DialogHeader overhead={t("partner.staffPage.dialog.overhead")}>
						<DialogTitle>
							{selectedStaff?.userName ??
								t("partner.staffPage.dialog.titleFallback")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody className="grid justify-items-start gap-6">
						{staffDetailQuery.isError ? (
							staffDetailQuery.error instanceof WebApiError &&
							staffDetailQuery.error.status === 404 ? (
								<NotFoundState
									title={t("partner.staffPage.dialog.notFound.title")}
									description={t(
										"partner.staffPage.dialog.notFound.description",
									)}
								/>
							) : (
								<SomeErrorState
									title={t("partner.staffPage.dialog.error.title")}
									description={t("partner.staffPage.dialog.error.description")}
									onRefresh={() => {
										void staffDetailQuery.refetch();
									}}
								/>
							)
						) : selectedStaff ? (
							<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
								<div className="grid gap-4">
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.staffPage.dialog.fields.userId")}
										</p>
										<p className="ty-sm-semibold">{selectedStaff.userId}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.staffPage.dialog.fields.name")}
										</p>
										<p className="ty-sm-semibold">{selectedStaff.userName}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.staffPage.dialog.fields.email")}
										</p>
										<p className="ty-sm-semibold">
											{selectedStaff.accountEmail}
										</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.staffPage.dialog.fields.entity")}
										</p>
										<p className="ty-sm-semibold">{selectedStaff.entityName}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.staffPage.dialog.fields.city")}
										</p>
										<p className="ty-sm-semibold">
											{resolveStaffCityLabel(cityById, selectedStaff.cityId)}
										</p>
									</div>
								</div>

								<div className="grid w-full content-start gap-6">
									<div className="grid gap-3">
										<p className="ty-overhead">
											{t("partner.staffPage.dialog.linkedAccount.overhead")}
										</p>
										{renderLinkedAccountBlock(
											t,
											linkedAccountQuery.data,
											linkedAccountQuery.isLoading,
											linkedAccountQuery.isError,
											linkedAccountQuery.error,
											() => {
												void linkedAccountQuery.refetch();
											},
										)}
									</div>

									<div className="grid gap-3">
										<p className="ty-overhead">
											{t("partner.staffPage.dialog.linkedUser.overhead")}
										</p>
										{renderLinkedUserBlock(
											t,
											linkedUserQuery.data,
											linkedUserQuery.isLoading,
											linkedUserQuery.isError,
											linkedUserQuery.error,
											() => {
												void linkedUserQuery.refetch();
											},
										)}
									</div>
								</div>
							</div>
						) : (
							<NotFoundState
								title={t("partner.staffPage.dialog.notFound.title")}
							/>
						)}
					</DialogBody>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={pendingStatusStaff !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingStatusStaff(null);
					}
				}}
			>
				<AlertDialogContent
					variant={pendingStatusStaff?.active ? "success" : "warning"}
				>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(
								pendingStatusStaff?.active
									? "partner.staffPage.reactivate.confirm.title"
									: "partner.staffPage.deactivate.confirm.title",
							)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(
								pendingStatusStaff?.active
									? "partner.staffPage.reactivate.confirm.description"
									: "partner.staffPage.deactivate.confirm.description",
								{
									name: pendingStatusStaff?.staff.userName ?? "",
								},
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t(
							pendingStatusStaff?.active
								? "partner.staffPage.table.actions.reactivate"
								: "partner.staffPage.table.actions.deactivate",
						)}
						onAction={handleStatusChangeConfirm}
					/>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={pendingDeleteStaff !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteStaff(null);
					}
				}}
			>
				<AlertDialogContent variant="danger">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("partner.staffPage.delete.confirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("partner.staffPage.delete.confirm.description", {
								name: pendingDeleteStaff?.userName ?? "",
							})}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("partner.staffPage.table.actions.delete")}
						onAction={handleDeleteConfirm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</PageShell>
	);
}

function renderLinkedAccountBlock(
	t: ReturnType<typeof useTranslation>["t"],
	account: AccountResponse | undefined,
	isLoading: boolean,
	isError: boolean,
	error: unknown,
	onRefresh: () => void,
) {
	if (isLoading) {
		return (
			<p className="ty-sm text-[color:var(--twc-muted)]">
				{t("partner.staffPage.dialog.linkedAccount.loading")}
			</p>
		);
	}

	if (isError) {
		if (error instanceof WebApiError && error.status === 404) {
			return (
				<NotFoundState
					title={t("partner.staffPage.dialog.linkedAccount.notFound.title")}
					description={t(
						"partner.staffPage.dialog.linkedAccount.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("partner.staffPage.dialog.linkedAccount.error.title")}
				description={t(
					"partner.staffPage.dialog.linkedAccount.error.description",
				)}
				onRefresh={onRefresh}
			/>
		);
	}

	if (!account) {
		return (
			<NotFoundState
				title={t("partner.staffPage.dialog.linkedAccount.notFound.title")}
			/>
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("partner.staffPage.dialog.linkedAccount.fields.id")}
				</p>
				<p className="ty-sm-semibold">{account.id}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("partner.staffPage.dialog.linkedAccount.fields.type")}
				</p>
				<div>
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={getAccountTypeTone(account.accountType)}
						variant="primary"
					>
						{getAccountTypeLabel(t, account.accountType)}
					</Badge>
				</div>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("partner.staffPage.dialog.linkedAccount.fields.active")}
				</p>
				<div>
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={account.active ? "success" : "danger"}
						variant="primary"
					>
						{account.active
							? t("partner.staffPage.dialog.linkedAccount.active.yes")
							: t("partner.staffPage.dialog.linkedAccount.active.no")}
					</Badge>
				</div>
			</div>
		</div>
	);
}

function renderLinkedUserBlock(
	t: ReturnType<typeof useTranslation>["t"],
	user:
		| {
				id: string;
				name: string;
				cpfFormatted: string;
		  }
		| undefined,
	isLoading: boolean,
	isError: boolean,
	error: unknown,
	onRefresh: () => void,
) {
	if (isLoading) {
		return (
			<p className="ty-sm text-[color:var(--twc-muted)]">
				{t("partner.staffPage.dialog.linkedUser.loading")}
			</p>
		);
	}

	if (isError) {
		if (error instanceof WebApiError && error.status === 404) {
			return (
				<NotFoundState
					title={t("partner.staffPage.dialog.linkedUser.notFound.title")}
					description={t(
						"partner.staffPage.dialog.linkedUser.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("partner.staffPage.dialog.linkedUser.error.title")}
				description={t("partner.staffPage.dialog.linkedUser.error.description")}
				onRefresh={onRefresh}
			/>
		);
	}

	if (!user) {
		return (
			<NotFoundState
				title={t("partner.staffPage.dialog.linkedUser.notFound.title")}
			/>
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("partner.staffPage.dialog.linkedUser.fields.id")}
				</p>
				<p className="ty-sm-semibold">{user.id}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("partner.staffPage.dialog.linkedUser.fields.name")}
				</p>
				<p className="ty-sm-semibold">{user.name}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("partner.staffPage.dialog.linkedUser.fields.cpf")}
				</p>
				<p className="ty-sm-semibold">{user.cpfFormatted}</p>
			</div>
		</div>
	);
}
