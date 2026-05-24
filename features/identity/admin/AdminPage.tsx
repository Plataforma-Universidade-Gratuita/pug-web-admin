"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import {
	CopyPlus,
	Eye,
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
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
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
import { useAccountsQuery } from "@/features/identity/account/queries";
import {
	getAccountTypeLabel,
	getAccountTypeTone,
} from "@/features/identity/account/utils";
import { AdminUpdateDrawer } from "@/features/identity/admin/AdminUpdateDrawer";
import {
	useRemoveAdminMutation,
	useSetAdminActiveMutation,
} from "@/features/identity/admin/mutations";
import {
	useAdminDetailQuery,
	useAdminsQuery,
	useLinkedAdminAccountQuery,
	useLinkedAdminUserQuery,
} from "@/features/identity/admin/queries";
import {
	createAdminColumns,
	filterAdmins,
	getAdminDeleteErrorToastContent,
	getAdminDetailErrorToastContent,
	getAdminEmptyStateCopy,
	getAdminFilterSummary,
	getAdminSetActiveErrorToastContent,
	getAdminsListErrorToastContent,
	getAdminCampusOptions,
	getLinkedAdminAccountErrorToastContent,
	getLinkedAdminUserErrorToastContent,
} from "@/features/identity/admin/utils";
import {
	ServicePageHeader,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { AccountResponse, AdminResponse } from "@/types/api";
import type {
	AdminCampusFilter,
	AdminEditorMode,
} from "@/types/client/identity";
import { WebApiError } from "@/utils/web-api";

export function AdminPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [campusFilter, setCampusFilter] = useState<AdminCampusFilter>("");
	const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
	const [editorState, setEditorState] = useState<{
		id: string | null;
		mode: AdminEditorMode;
	} | null>(null);
	const [pendingStatusAdmin, setPendingStatusAdmin] = useState<{
		active: boolean;
		admin: AdminResponse;
	} | null>(null);
	const [pendingDeleteAdmin, setPendingDeleteAdmin] =
		useState<AdminResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const adminsQuery = useAdminsQuery();
	const accountsQuery = useAccountsQuery();
	const adminDetailQuery = useAdminDetailQuery(selectedAdminId);
	const linkedAccountQuery = useLinkedAdminAccountQuery(
		adminDetailQuery.data?.accountId ?? null,
	);
	const linkedUserQuery = useLinkedAdminUserQuery(
		adminDetailQuery.data?.userId ?? null,
	);
	const listErrorToastAtRef = useRef(0);
	const detailErrorToastAtRef = useRef(0);
	const linkedAccountErrorToastAtRef = useRef(0);
	const linkedUserErrorToastAtRef = useRef(0);
	const deleteTimersRef = useRef(
		new Map<string, ReturnType<typeof setTimeout>>(),
	);
	const setAdminActiveMutation = useSetAdminActiveMutation();
	const removeAdminMutation = useRemoveAdminMutation();

	const allAdmins = useMemo(() => adminsQuery.data ?? [], [adminsQuery.data]);
	const accountById = useMemo(
		() =>
			new Map((accountsQuery.data ?? []).map(account => [account.id, account])),
		[accountsQuery.data],
	);
	const filteredAdmins = useMemo(
		() =>
			filterAdmins(allAdmins, {
				campusFilter,
				query: deferredQuerySearch,
			}),
		[allAdmins, campusFilter, deferredQuerySearch],
	);
	const columns = useMemo(() => createAdminColumns(t), [t]);
	const campusOptions = useMemo(() => getAdminCampusOptions(t), [t]);
	const selectedAdmin = adminDetailQuery.data;
	const hasAnyFilters = Boolean(querySearch.trim() || campusFilter);
	const filterSummary = useMemo(
		() =>
			getAdminFilterSummary(t, {
				campusFilter,
				query: deferredQuerySearch,
			}),
		[campusFilter, deferredQuerySearch, t],
	);
	const emptyStateCopy = useMemo(
		() => getAdminEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (adminsQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.adminPage.table.error.title")}
					description={t("identity.adminPage.table.error.description")}
					onRefresh={() => {
						void adminsQuery.refetch();
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
	}, [adminsQuery, emptyStateCopy.description, emptyStateCopy.title, t]);

	useEffect(() => {
		if (!adminsQuery.isError || adminsQuery.errorUpdatedAt === 0) {
			return;
		}

		if (listErrorToastAtRef.current === adminsQuery.errorUpdatedAt) {
			return;
		}

		listErrorToastAtRef.current = adminsQuery.errorUpdatedAt;
		const { title, description } = getAdminsListErrorToastContent(
			t,
			adminsQuery.error,
		);
		toast.danger(title, { description });
	}, [adminsQuery.error, adminsQuery.errorUpdatedAt, adminsQuery.isError, t]);

	useEffect(() => {
		if (!adminDetailQuery.isError || adminDetailQuery.errorUpdatedAt === 0) {
			return;
		}

		if (detailErrorToastAtRef.current === adminDetailQuery.errorUpdatedAt) {
			return;
		}

		detailErrorToastAtRef.current = adminDetailQuery.errorUpdatedAt;
		const { title, description } = getAdminDetailErrorToastContent(
			t,
			adminDetailQuery.error,
		);
		toast.danger(title, { description });
	}, [
		adminDetailQuery.error,
		adminDetailQuery.errorUpdatedAt,
		adminDetailQuery.isError,
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
		const { title, description } = getLinkedAdminAccountErrorToastContent(
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
		const { title, description } = getLinkedAdminUserErrorToastContent(
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
		const deleteTimers = deleteTimersRef.current;

		return () => {
			for (const timeoutId of deleteTimers.values()) {
				clearTimeout(timeoutId);
			}

			deleteTimers.clear();
		};
	}, []);

	function clearFilters() {
		setQuerySearch("");
		setCampusFilter("");
	}

	function handleStatusChangeConfirm() {
		if (!pendingStatusAdmin) {
			return;
		}

		const { active, admin } = pendingStatusAdmin;

		setAdminActiveMutation.mutate(
			{
				active,
				id: admin.accountId,
			},
			{
				onSuccess: () => {
					toast.success(
						t(
							active
								? "identity.adminPage.reactivate.feedback.success.title"
								: "identity.adminPage.deactivate.feedback.success.title",
						),
						{
							description: t(
								active
									? "identity.adminPage.reactivate.feedback.success.description"
									: "identity.adminPage.deactivate.feedback.success.description",
								{
									name: admin.userName,
								},
							),
						},
					);
					setPendingStatusAdmin(null);
				},
				onError: error => {
					const { title, description } = getAdminSetActiveErrorToastContent(
						t,
						error,
						active,
					);
					toast.danger(title, { description });
					setPendingStatusAdmin(null);
				},
			},
		);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteAdmin) {
			return;
		}

		const admin = pendingDeleteAdmin;
		const existingTimer = deleteTimersRef.current.get(admin.accountId);

		if (existingTimer) {
			clearTimeout(existingTimer);
		}

		const timeoutId = setTimeout(() => {
			deleteTimersRef.current.delete(admin.accountId);
			removeAdminMutation.mutate(
				{
					accountId: admin.accountId,
					userId: admin.userId,
				},
				{
					onSuccess: () => {
						toast.success(
							t("identity.adminPage.delete.feedback.success.title"),
							{
								description: t(
									"identity.adminPage.delete.feedback.success.description",
									{
										name: admin.userName,
									},
								),
							},
						);

						if (selectedAdminId === admin.accountId) {
							setSelectedAdminId(null);
						}

						if (editorState?.id === admin.accountId) {
							setEditorState(null);
						}
					},
					onError: error => {
						const { title, description } = getAdminDeleteErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
		}, 5000);

		deleteTimersRef.current.set(admin.accountId, timeoutId);
		setPendingDeleteAdmin(null);

		toast.undo(t("identity.adminPage.delete.undo.title"), {
			description: t("identity.adminPage.delete.undo.description", {
				name: admin.userName,
			}),
			undoLabel: t("identity.adminPage.delete.undo.action"),
			duration: 5000,
			onUndo: () => {
				const scheduledTimeout = deleteTimersRef.current.get(admin.accountId);

				if (scheduledTimeout) {
					clearTimeout(scheduledTimeout);
					deleteTimersRef.current.delete(admin.accountId);
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
				title={t("identity.adminPage.title")}
				description={t("identity.adminPage.description")}
				metadata={{
					triggerLabel: t("identity.adminPage.metadata.trigger"),
					emptyTitle: t("identity.adminPage.metadata.empty.title"),
					emptyDescription: t("identity.adminPage.metadata.empty.description"),
				}}
				actions={
					<>
						{hasAnyFilters ? (
							<Button
								variant="secondary"
								onClick={clearFilters}
							>
								{t("identity.adminPage.filters.clear")}
							</Button>
						) : null}
						<Button
							leadingIcon={<Plus className="h-4 w-4" />}
							onClick={() => setEditorState({ id: null, mode: "create" })}
						>
							{t("identity.adminPage.create.open")}
						</Button>
					</>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(16rem,0.9fr)]"
			>
				<TextFieldFilter
					label={t("identity.adminPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("identity.adminPage.filters.search.placeholder")}
				/>

				<div className="grid gap-2">
					<Label>{t("identity.adminPage.filters.campus.label")}</Label>
					<Select
						value={campusFilter || "ALL"}
						onValueChange={value =>
							setCampusFilter(
								value === "ALL" ? "" : (value as AdminCampusFilter),
							)
						}
					>
						<SelectTrigger
							className="w-full"
							placeholder={t("identity.adminPage.filters.campus.placeholder")}
						/>
						<SelectContent>
							<SelectItem value="ALL">
								{t("identity.adminPage.filters.campus.options.all")}
							</SelectItem>
							{campusOptions.map(option => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</ServicePageHeader>

			<ServicePageTableSection<AdminResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAdmins,
					emptyState: tableEmptyState,
					getRowActions: row => {
						const isActive = accountById.get(row.accountId)?.active ?? true;

						return (
							<>
								<DropdownMenuInfoItem
									icon={Eye}
									label={t("identity.adminPage.table.actions.viewDetails")}
									onClick={() => setSelectedAdminId(row.accountId)}
								/>
								<DropdownMenuInfoItem
									icon={PenSquare}
									label={t("identity.adminPage.table.actions.update")}
									onClick={() =>
										setEditorState({ id: row.accountId, mode: "update" })
									}
								/>
								<DropdownMenuInfoItem
									icon={CopyPlus}
									label={t("identity.adminPage.table.actions.duplicate")}
									onClick={() =>
										setEditorState({ id: row.accountId, mode: "duplicate" })
									}
								/>
								<DropdownMenuSeparator />
								{isActive ? (
									<DropdownMenuWarningItem
										icon={ShieldX}
										label={t("identity.adminPage.table.actions.deactivate")}
										onClick={() =>
											setPendingStatusAdmin({ active: false, admin: row })
										}
									/>
								) : (
									<DropdownMenuSuccessItem
										icon={ShieldCheck}
										label={t("identity.adminPage.table.actions.reactivate")}
										onClick={() =>
											setPendingStatusAdmin({ active: true, admin: row })
										}
									/>
								)}
								<DropdownMenuDangerItem
									icon={Trash2}
									label={t("identity.adminPage.table.actions.delete")}
									onClick={() => setPendingDeleteAdmin(row)}
								/>
							</>
						);
					},
					isLoading: adminsQuery.isLoading,
					loadingLabel: t("identity.adminPage.loading.list"),
				}}
			/>

			<AdminUpdateDrawer
				adminId={editorState?.id ?? null}
				mode={editorState?.mode ?? "update"}
				open={editorState !== null}
				onOpenChange={open => {
					if (!open) {
						setEditorState(null);
					}
				}}
			/>

			<Dialog
				open={selectedAdminId !== null}
				onOpenChange={open => {
					if (!open) {
						setSelectedAdminId(null);
					}
				}}
				isLoading={adminDetailQuery.isLoading}
				loadingLabel={t("identity.adminPage.loading.detail")}
			>
				<DialogContent>
					<DialogHeader overhead={t("identity.adminPage.dialog.overhead")}>
						<DialogTitle>
							{selectedAdmin?.userName ??
								t("identity.adminPage.dialog.titleFallback")}
						</DialogTitle>
					</DialogHeader>
					<DialogBody className="grid justify-items-start gap-6">
						{adminDetailQuery.isError ? (
							adminDetailQuery.error instanceof WebApiError &&
							adminDetailQuery.error.status === 404 ? (
								<NotFoundState
									title={t("identity.adminPage.dialog.notFound.title")}
									description={t(
										"identity.adminPage.dialog.notFound.description",
									)}
								/>
							) : (
								<SomeErrorState
									title={t("identity.adminPage.dialog.error.title")}
									description={t("identity.adminPage.dialog.error.description")}
									onRefresh={() => {
										void adminDetailQuery.refetch();
									}}
								/>
							)
						) : selectedAdmin ? (
							<div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
								<div className="grid gap-4">
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.adminPage.dialog.fields.userId")}
										</p>
										<p className="ty-sm-semibold">{selectedAdmin.userId}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.adminPage.dialog.fields.name")}
										</p>
										<p className="ty-sm-semibold">{selectedAdmin.userName}</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.adminPage.dialog.fields.email")}
										</p>
										<p className="ty-sm-semibold">
											{selectedAdmin.accountEmail}
										</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.adminPage.dialog.fields.campus")}
										</p>
										<p className="ty-sm-semibold">
											{selectedAdmin.campus.campusFormatted}
										</p>
									</div>
									<div className="grid gap-1">
										<p className="ty-helper">
											{t("identity.adminPage.dialog.fields.grantedAt")}
										</p>
										<p className="ty-sm-semibold">
											{selectedAdmin.grantedAtFormatted}
										</p>
									</div>
								</div>

								<div className="grid w-full content-start gap-6">
									<div className="grid gap-3">
										<p className="ty-overhead">
											{t("identity.adminPage.dialog.linkedAccount.overhead")}
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
											{t("identity.adminPage.dialog.linkedUser.overhead")}
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
								title={t("identity.adminPage.dialog.notFound.title")}
							/>
						)}
					</DialogBody>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={pendingStatusAdmin !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingStatusAdmin(null);
					}
				}}
			>
				<AlertDialogContent
					variant={pendingStatusAdmin?.active ? "success" : "warning"}
				>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(
								pendingStatusAdmin?.active
									? "identity.adminPage.reactivate.confirm.title"
									: "identity.adminPage.deactivate.confirm.title",
							)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(
								pendingStatusAdmin?.active
									? "identity.adminPage.reactivate.confirm.description"
									: "identity.adminPage.deactivate.confirm.description",
								{
									name: pendingStatusAdmin?.admin.userName ?? "",
								},
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t(
							pendingStatusAdmin?.active
								? "identity.adminPage.table.actions.reactivate"
								: "identity.adminPage.table.actions.deactivate",
						)}
						onAction={handleStatusChangeConfirm}
					/>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={pendingDeleteAdmin !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteAdmin(null);
					}
				}}
			>
				<AlertDialogContent variant="danger">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("identity.adminPage.delete.confirm.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("identity.adminPage.delete.confirm.description", {
								name: pendingDeleteAdmin?.userName ?? "",
							})}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter
						cancelLabel={t("common.cancel")}
						actionLabel={t("identity.adminPage.table.actions.delete")}
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
				{t("identity.adminPage.dialog.linkedAccount.loading")}
			</p>
		);
	}

	if (isError) {
		if (error instanceof WebApiError && error.status === 404) {
			return (
				<NotFoundState
					title={t("identity.adminPage.dialog.linkedAccount.notFound.title")}
					description={t(
						"identity.adminPage.dialog.linkedAccount.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("identity.adminPage.dialog.linkedAccount.error.title")}
				description={t(
					"identity.adminPage.dialog.linkedAccount.error.description",
				)}
				onRefresh={onRefresh}
			/>
		);
	}

	if (!account) {
		return (
			<NotFoundState
				title={t("identity.adminPage.dialog.linkedAccount.notFound.title")}
			/>
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.dialog.linkedAccount.fields.id")}
				</p>
				<p className="ty-sm-semibold">{account.id}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.dialog.linkedAccount.fields.type")}
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
					{t("identity.adminPage.dialog.linkedAccount.fields.active")}
				</p>
				<div>
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={account.active ? "success" : "danger"}
						variant="primary"
					>
						{account.active
							? t("identity.adminPage.dialog.linkedAccount.active.yes")
							: t("identity.adminPage.dialog.linkedAccount.active.no")}
					</Badge>
				</div>
			</div>
		</div>
	);
}

function renderLinkedUserBlock(
	t: ReturnType<typeof useTranslation>["t"],
	user: { id: string; name: string; cpfFormatted: string } | undefined,
	isLoading: boolean,
	isError: boolean,
	error: unknown,
	onRefresh: () => void,
) {
	if (isLoading) {
		return (
			<p className="ty-sm text-[color:var(--twc-muted)]">
				{t("identity.adminPage.dialog.linkedUser.loading")}
			</p>
		);
	}

	if (isError) {
		if (error instanceof WebApiError && error.status === 404) {
			return (
				<NotFoundState
					title={t("identity.adminPage.dialog.linkedUser.notFound.title")}
					description={t(
						"identity.adminPage.dialog.linkedUser.notFound.description",
					)}
				/>
			);
		}

		return (
			<SomeErrorState
				title={t("identity.adminPage.dialog.linkedUser.error.title")}
				description={t(
					"identity.adminPage.dialog.linkedUser.error.description",
				)}
				onRefresh={onRefresh}
			/>
		);
	}

	if (!user) {
		return (
			<NotFoundState
				title={t("identity.adminPage.dialog.linkedUser.notFound.title")}
			/>
		);
	}

	return (
		<div className="grid gap-4">
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.dialog.linkedUser.fields.id")}
				</p>
				<p className="ty-sm-semibold">{user.id}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.dialog.linkedUser.fields.name")}
				</p>
				<p className="ty-sm-semibold">{user.name}</p>
			</div>
			<div className="grid gap-1">
				<p className="ty-helper">
					{t("identity.adminPage.dialog.linkedUser.fields.cpf")}
				</p>
				<p className="ty-sm-semibold">{user.cpfFormatted}</p>
			</div>
		</div>
	);
}
