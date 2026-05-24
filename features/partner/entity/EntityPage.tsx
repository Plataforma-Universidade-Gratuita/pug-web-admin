"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { CopyPlus, Eye, Filter, PenSquare, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
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
    Label,
    NoContentState,
    NotFoundState,
    PageShell,
    SomeErrorState,
    toast,
} from "@/components";
import { EntityEditorDrawer } from "@/features/partner/entity/EntityEditorDrawer";
import { useRemoveEntityMutation } from "@/features/partner/entity/mutations";
import {
	useEntitiesQuery,
	useEntityCitiesQuery,
	useEntityDetailQuery,
} from "@/features/partner/entity/queries";
import {
	buildEntityCityOptions,
	createEntityColumns,
	filterEntities,
	getEntitiesListErrorToastContent,
	getEntityCitiesErrorToastContent,
	getEntityDeleteErrorToastContent,
	getEntityDetailErrorToastContent,
	getEntityEmptyStateCopy,
	getEntityFilterSummary,
	resolveEntityCityLabel,
} from "@/features/partner/entity/utils";
import {
	AuditInfoFilterFields,
	ServicePageHeader,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { EntityResponse } from "@/types/api";
import type {
	EntityAuditDateField,
	EntityEditorMode,
} from "@/types/client/partner";
import { WebApiError } from "@/utils/web-api";

export function EntityPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [draftCityIdFilter, setDraftCityIdFilter] = useState("");
	const [draftDateField, setDraftDateField] =
		useState<EntityAuditDateField>("");
	const [draftStartDate, setDraftStartDate] = useState("");
	const [draftEndDate, setDraftEndDate] = useState("");
	const [cityIdFilter, setCityIdFilter] = useState("");
	const [dateField, setDateField] = useState<EntityAuditDateField>("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
	const [editorState, setEditorState] = useState<{
		id: string | null;
		mode: EntityEditorMode;
	} | null>(null);
	const [pendingDeleteEntity, setPendingDeleteEntity] =
		useState<EntityResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const entitiesQuery = useEntitiesQuery();
	const citiesQuery = useEntityCitiesQuery();
	const entityDetailQuery = useEntityDetailQuery(selectedEntityId);
	const listErrorToastAtRef = useRef(0);
	const citiesErrorToastAtRef = useRef(0);
	const detailErrorToastAtRef = useRef(0);
	const deleteTimersRef = useRef(
		new Map<string, ReturnType<typeof setTimeout>>(),
	);
	const removeEntityMutation = useRemoveEntityMutation();
	const allEntities = useMemo(
		() => entitiesQuery.data ?? [],
		[entitiesQuery.data],
	);
	const allCities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data]);
	const cityById = useMemo(
		() => new Map(allCities.map(city => [city.id, city])),
		[allCities],
	);
	const cityOptions = useMemo(
		() => buildEntityCityOptions(allCities),
		[allCities],
	);
	const filteredEntities = useMemo(
		() =>
			filterEntities(allEntities, {
				query: deferredQuerySearch,
				cityIdFilter,
				dateField,
				startDate,
				endDate,
				cityById,
			}),
		[
			allEntities,
			cityById,
			cityIdFilter,
			dateField,
			deferredQuerySearch,
			endDate,
			startDate,
		],
	);
	const columns = useMemo(
		() => createEntityColumns(t, cityById),
		[cityById, t],
	);
	const selectedEntity = entityDetailQuery.data;
	const hasSecondaryFilters = Boolean(
		cityIdFilter || dateField || startDate || endDate,
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasSecondaryFilters);
	const filterSummary = useMemo(
		() =>
			getEntityFilterSummary(t, {
				query: deferredQuerySearch,
				cityIdFilter,
				dateField,
				startDate,
				endDate,
				cityById,
			}),
		[
			cityById,
			cityIdFilter,
			dateField,
			deferredQuerySearch,
			endDate,
			startDate,
			t,
		],
	);
	const emptyStateCopy = useMemo(
		() => getEntityEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (entitiesQuery.isError) {
			return (
				<SomeErrorState
					title={t("partner.entityPage.table.error.title")}
					description={t("partner.entityPage.table.error.description")}
					onRefresh={() => {
						void entitiesQuery.refetch();
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
	}, [emptyStateCopy.description, emptyStateCopy.title, entitiesQuery, t]);

	useEffect(() => {
		if (!entitiesQuery.isError || entitiesQuery.errorUpdatedAt === 0) {
			return;
		}

		if (listErrorToastAtRef.current === entitiesQuery.errorUpdatedAt) {
			return;
		}

		listErrorToastAtRef.current = entitiesQuery.errorUpdatedAt;
		const { title, description } = getEntitiesListErrorToastContent(
			t,
			entitiesQuery.error,
		);
		toast.danger(title, { description });
	}, [
		entitiesQuery.error,
		entitiesQuery.errorUpdatedAt,
		entitiesQuery.isError,
		t,
	]);

	useEffect(() => {
		if (!citiesQuery.isError || citiesQuery.errorUpdatedAt === 0) {
			return;
		}

		if (citiesErrorToastAtRef.current === citiesQuery.errorUpdatedAt) {
			return;
		}

		citiesErrorToastAtRef.current = citiesQuery.errorUpdatedAt;
		const { title, description } = getEntityCitiesErrorToastContent(
			t,
			citiesQuery.error,
		);
		toast.danger(title, { description });
	}, [citiesQuery.error, citiesQuery.errorUpdatedAt, citiesQuery.isError, t]);

	useEffect(() => {
		if (!entityDetailQuery.isError || entityDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === entityDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = entityDetailQuery.errorUpdatedAt;
		const { title, description } = getEntityDetailErrorToastContent(
			t,
			entityDetailQuery.error,
		);
		toast.danger(title, { description });
	}, [
		entityDetailQuery.error,
		entityDetailQuery.errorUpdatedAt,
		entityDetailQuery.isError,
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
		setCityIdFilter(draftCityIdFilter);
		setDateField(draftDateField);
		setStartDate(draftStartDate);
		setEndDate(draftEndDate);
		setFiltersOpen(false);
	}

	function clearAllFilters() {
		setQuerySearch("");
		setDraftCityIdFilter("");
		setDraftDateField("");
		setDraftStartDate("");
		setDraftEndDate("");
		setCityIdFilter("");
		setDateField("");
		setStartDate("");
		setEndDate("");
		setFiltersOpen(false);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteEntity) {
			return;
		}

		const entity = pendingDeleteEntity;
		const existingTimer = deleteTimersRef.current.get(entity.id);

		if (existingTimer) {
			clearTimeout(existingTimer);
		}

		const timeoutId = setTimeout(() => {
			deleteTimersRef.current.delete(entity.id);
			removeEntityMutation.mutate(
				{
					id: entity.id,
				},
				{
					onSuccess: () => {
						toast.success(
							t("partner.entityPage.delete.feedback.success.title"),
							{
								description: t(
									"partner.entityPage.delete.feedback.success.description",
									{
										name: entity.name,
									},
								),
							},
						);

						if (selectedEntityId === entity.id) {
							setSelectedEntityId(null);
						}

						if (editorState?.id === entity.id) {
							setEditorState(null);
						}
					},
					onError: error => {
						const { title, description } = getEntityDeleteErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
		}, 5000);

		deleteTimersRef.current.set(entity.id, timeoutId);
		setPendingDeleteEntity(null);

		toast.undo(t("partner.entityPage.delete.undo.title"), {
			description: t("partner.entityPage.delete.undo.description", {
				name: entity.name,
			}),
			undoLabel: t("partner.entityPage.delete.undo.action"),
			duration: 5000,
			onUndo: () => {
				const scheduledTimeout = deleteTimersRef.current.get(entity.id);

				if (scheduledTimeout) {
					clearTimeout(scheduledTimeout);
					deleteTimersRef.current.delete(entity.id);
				}
			},
		});
	}

	return (
		<PageShell
			width="wide"
			className="grid h-[calc(100dvh-4.5rem)] min-h-[48rem] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden p-4 lg:p-6"
		>
			<ServicePageHeader
				title={t("partner.entityPage.title")}
				description={t("partner.entityPage.description")}
				metadata={{
					triggerLabel: t("partner.entityPage.metadata.trigger"),
					emptyTitle: t("partner.entityPage.metadata.empty.title"),
					emptyDescription: t("partner.entityPage.metadata.empty.description"),
				}}
				actions={
					<>
						{hasAnyFilters ? (
							<Button
								variant="secondary"
								onClick={clearAllFilters}
							>
								{t("partner.entityPage.filters.clear")}
							</Button>
						) : null}
						<Button
							leadingIcon={<Plus className="h-4 w-4" />}
							onClick={() => setEditorState({ id: null, mode: "create" })}
						>
							{t("partner.entityPage.create.open")}
						</Button>
					</>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("partner.entityPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("partner.entityPage.filters.search.placeholder")}
				/>

				<Drawer
					open={filtersOpen}
					onOpenChange={setFiltersOpen}
				>
					<div className="grid gap-2 self-end">
						<Label>{t("partner.entityPage.filters.drawer.label")}</Label>
						<Button
							variant="secondary"
							usage={hasSecondaryFilters ? "info" : "secondary"}
							className="w-full justify-start lg:min-w-56"
							onClick={() => setFiltersOpen(true)}
						>
							{hasSecondaryFilters
								? t("partner.entityPage.filters.drawer.active")
								: t("partner.entityPage.filters.drawer.trigger")}
						</Button>
					</div>
					<DrawerContent>
						<DrawerHeader
							overhead={t("partner.entityPage.filters.drawer.overhead")}
						>
							<DrawerTitle>
								{t("partner.entityPage.filters.drawer.title")}
							</DrawerTitle>
						</DrawerHeader>
						<DrawerBody className="grid gap-6">
							{citiesQuery.isError ? (
								<SomeErrorState
									title={t("partner.entityPage.filters.city.error.title")}
									description={t(
										"partner.entityPage.filters.city.error.description",
									)}
									onRefresh={() => {
										void citiesQuery.refetch();
									}}
								/>
							) : (
								<div className="grid gap-2">
									<Label>{t("partner.entityPage.filters.city.label")}</Label>
									<Combobox
										options={cityOptions}
										value={draftCityIdFilter}
										onValueChange={setDraftCityIdFilter}
										placeholder={t(
											"partner.entityPage.filters.city.placeholder",
										)}
										searchPlaceholder={t(
											"partner.entityPage.filters.city.searchPlaceholder",
										)}
										emptyMessage={t(
											"partner.entityPage.filters.city.emptyMessage",
										)}
										disabled={citiesQuery.isLoading}
									/>
								</div>
							)}

							<AuditInfoFilterFields
								dateFieldLabel={t("partner.entityPage.filters.dateField.label")}
								dateFieldPlaceholder={t(
									"partner.entityPage.filters.dateField.placeholder",
								)}
								dateField={draftDateField}
								onDateFieldChange={value =>
									setDraftDateField(value as EntityAuditDateField)
								}
								dateFieldOptions={[
									{
										value: "createdAt",
										label: t(
											"partner.entityPage.filters.dateField.options.createdAt",
										),
									},
									{
										value: "updatedAt",
										label: t(
											"partner.entityPage.filters.dateField.options.updatedAt",
										),
									},
								]}
								startDateLabel={t("partner.entityPage.filters.startDate.label")}
								startDatePlaceholder={t(
									"partner.entityPage.filters.startDate.placeholder",
								)}
								startDate={draftStartDate}
								onStartDateChange={setDraftStartDate}
								endDateLabel={t("partner.entityPage.filters.endDate.label")}
								endDatePlaceholder={t(
									"partner.entityPage.filters.endDate.placeholder",
								)}
								endDate={draftEndDate}
								onEndDateChange={setDraftEndDate}
							/>
						</DrawerBody>
						<DrawerFooter
							clearConfirmTitle={t(
								"partner.entityPage.filters.drawer.clearConfirm.title",
							)}
							clearConfirmDescription={t(
								"partner.entityPage.filters.drawer.clearConfirm.description",
							)}
							clearLabel={t("partner.entityPage.filters.clear")}
							actionLabel={t("partner.entityPage.filters.drawer.apply")}
							actionIcon={Filter}
							onClear={clearAllFilters}
							onAction={applySecondaryFilters}
						/>
					</DrawerContent>
				</Drawer>
			</ServicePageHeader>

			<ServicePageTableSection<EntityResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredEntities,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<>
							<DropdownMenuInfoItem
								icon={Eye}
								label={t("partner.entityPage.table.actions.viewDetails")}
								onClick={() => setSelectedEntityId(row.id)}
							/>
							<DropdownMenuItem
								icon={PenSquare}
								label={t("partner.entityPage.table.actions.update")}
								onClick={() => setEditorState({ id: row.id, mode: "update" })}
							/>
							<DropdownMenuItem
								icon={CopyPlus}
								label={t("partner.entityPage.table.actions.duplicate")}
								onClick={() =>
									setEditorState({ id: row.id, mode: "duplicate" })
								}
							/>
							<DropdownMenuSeparator />
							<DropdownMenuDangerItem
								icon={Trash2}
								label={t("partner.entityPage.table.actions.delete")}
								onClick={() => setPendingDeleteEntity(row)}
							/>
						</>
					),
					isLoading: entitiesQuery.isLoading,
					loadingLabel: t("partner.entityPage.loading.list"),
				}}
			/>

			<EntityEditorDrawer
				entityId={editorState?.id ?? null}
				mode={editorState?.mode ?? "update"}
				open={editorState !== null}
				onOpenChange={open => {
					if (!open) {
						setEditorState(null);
					}
				}}
			/>

			<Dialog
				open={selectedEntityId !== null}
				onOpenChange={open => {
					if (!open) {
						setSelectedEntityId(null);
					}
				}}
				isLoading={entityDetailQuery.isLoading}
				loadingLabel={t("partner.entityPage.loading.detail")}
			>
				<DialogContent>
					<DialogHeader overhead={t("partner.entityPage.dialog.overhead")}>
						<DialogTitle>
							{selectedEntity?.name ??
								t("partner.entityPage.dialog.titleFallback")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody className="grid justify-items-start gap-6">
						{entityDetailQuery.isError ? (
							entityDetailQuery.error instanceof WebApiError &&
							entityDetailQuery.error.status === 404 ? (
								<NotFoundState
									title={t("partner.entityPage.dialog.notFound.title")}
									description={t(
										"partner.entityPage.dialog.notFound.description",
									)}
								/>
							) : (
								<SomeErrorState
									title={t("partner.entityPage.dialog.error.title")}
									description={t("partner.entityPage.dialog.error.description")}
									onRefresh={() => {
										void entityDetailQuery.refetch();
									}}
								/>
							)
						) : selectedEntity ? (
							<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
								<div className="grid gap-4">
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.entityPage.dialog.fields.name")}
										</p>
										<p className="ty-sm-semibold">{selectedEntity.name}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.entityPage.dialog.fields.cnpj")}
										</p>
										<p className="ty-sm-semibold">
											{selectedEntity.cnpjFormatted}
										</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.entityPage.dialog.fields.city")}
										</p>
										<p className="ty-sm-semibold">
											{resolveEntityCityLabel(cityById, selectedEntity.cityId)}
										</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.entityPage.dialog.fields.address")}
										</p>
										<p className="ty-sm-semibold">
											{selectedEntity.address ||
												t("partner.entityPage.dialog.values.noAddress")}
										</p>
									</div>
								</div>

								<div className="grid gap-4">
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.entityPage.dialog.fields.id")}
										</p>
										<p className="ty-sm-semibold">{selectedEntity.id}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.entityPage.dialog.fields.createdAt")}
										</p>
										<p className="ty-sm-semibold">
											{selectedEntity.auditInfo.createdAtFormatted}
										</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("partner.entityPage.dialog.fields.updatedAt")}
										</p>
										<p className="ty-sm-semibold">
											{selectedEntity.auditInfo.updatedAtFormatted}
										</p>
									</div>
								</div>
							</div>
						) : (
							<NotFoundState
								title={t("partner.entityPage.dialog.notFound.title")}
							/>
						)}
					</DialogBody>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={pendingDeleteEntity !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteEntity(null);
					}
				}}
			>
				<AlertDialogContent variant="danger">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("partner.entityPage.delete.confirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("partner.entityPage.delete.confirm.description", {
								name: pendingDeleteEntity?.name ?? "",
							})}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("partner.entityPage.table.actions.delete")}
						onAction={handleDeleteConfirm}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</PageShell>
	);
}
