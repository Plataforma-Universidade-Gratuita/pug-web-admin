"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useAccountsQuery } from "@/api/web/identity/accounts";
import { get as getAdmin } from "@/api/web/identity/admins";
import {
	useCreateAdminMutation,
	useRemoveAdminMutation,
	useSetAdminActiveMutation,
} from "@/api/web/identity/admins";
import {
	useAdminsSearchQuery,
	useCurrentAdminQuery,
} from "@/api/web/identity/admins";
import { get as getUser } from "@/api/web/identity/users";
import {
	NoContentState,
	RecordActionDialogs,
	SomeErrorState,
	toast,
} from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { AdminsFilters } from "@/features/identity/admins/AdminsFilters";
import { AdminsRowActions } from "@/features/identity/admins/AdminsRowActions";
import { AdminsUpdateDrawer } from "@/features/identity/admins/AdminsUpdateDrawer";
import {
	appendCopyToEmail,
	createAdminColumns,
	filterAdminsByBackendFilters,
	filterAdminsByFrontendFilters,
	getAdminDeleteErrorToastContent,
	getAdminDuplicateErrorToastContent,
	getAdminEmptyStateCopy,
	getAdminFilterSummary,
	getAdminSetActiveErrorToastContent,
	getAdminsListErrorToastContent,
} from "@/features/identity/admins/utils";
import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import {
	useActivatableRecordActions,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
	useServicePagePagination,
} from "@/hooks";
import type {
	AdminComplexSearchFilters,
	AdminEditorMode,
	AdminSearchResponse,
	Campi,
} from "@/types";

const ADMIN_ALL_PAGE_SIZE = 2147483647;

export function AdminsPage() {
	const { t } = useTranslation();
	const [frontendQuerySearch, setFrontendQuerySearch] = useState("");
	const [frontendCampusFilters, setFrontendCampusFilters] = useState<Campi[]>(
		[],
	);
	const [backendFiltersOpen, setBackendFiltersOpen] = useState(false);
	const editorState = useServicePageEditorState<AdminEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const deferredFrontendQuerySearch = useDeferredValue(
		frontendQuerySearch.trim(),
	);
	const {
		appliedFilters,
		applyDraftFilters,
		clearFilters,
		draftFilters,
		hasAppliedFilters,
		setDraftFilter,
	} = useDraftFilters<AdminComplexSearchFilters>({
		initialFilters: {
			name: "",
			cpf: "",
			email: "",
			dateFrom: "",
			dateTo: "",
			activeOnly: true,
		},
	});
	const adminsPagination = useServicePagePagination({
		key: "identity.admins",
	});
	const adminsSearchQuery = useAdminsSearchQuery(
		adminsPagination.isAll ? 0 : (adminsPagination.backendPage ?? 0),
		adminsPagination.isAll
			? ADMIN_ALL_PAGE_SIZE
			: (adminsPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE),
		appliedFilters,
	);
	const accountsQuery = useAccountsQuery();
	const currentAdminQuery = useCurrentAdminQuery();
	const createAdminMutation = useCreateAdminMutation();
	const setAdminActiveMutation = useSetAdminActiveMutation();
	const removeAdminMutation = useRemoveAdminMutation();
	const {
		confirmDelete,
		confirmStatusChange,
		pendingDeleteRecord,
		pendingStatusRecord,
		setPendingDeleteRecord,
		setPendingStatusRecord,
	} = useActivatableRecordActions<
		AdminSearchResponse,
		{ active: boolean; id: string },
		{ accountId: string; userId: string }
	>({
		deleteMutation: removeAdminMutation,
		getDeleteErrorToastContent: error =>
			getAdminDeleteErrorToastContent(t, error),
		getDeleteSuccessToastContent: admin => ({
			title: t("identity.adminPage.delete.feedback.success.title"),
			description: t("identity.adminPage.delete.feedback.success.description", {
				name: admin.account.user.name,
			}),
		}),
		getDeleteUndoToastContent: admin => ({
			key: admin.account.id,
			title: t("identity.adminPage.delete.undo.title"),
			description: t("identity.adminPage.delete.undo.description", {
				name: admin.account.user.name,
			}),
			undoLabel: t("common.actions.undo"),
		}),
		getDeleteVariables: admin => ({
			accountId: admin.account.id,
			userId: admin.account.user.id,
		}),
		getStatusErrorToastContent: (error, _admin, active) =>
			getAdminSetActiveErrorToastContent(t, error, active),
		getStatusSuccessToastContent: (admin, active) => ({
			title: t(
				active
					? "identity.adminPage.reactivate.feedback.success.title"
					: "identity.adminPage.deactivate.feedback.success.title",
			),
			description: t(
				active
					? "identity.adminPage.reactivate.feedback.success.description"
					: "identity.adminPage.deactivate.feedback.success.description",
				{
					name: admin.account.user.name,
				},
			),
		}),
		getStatusVariables: (admin, active) => ({
			active,
			id: admin.account.id,
		}),
		onDeleteSuccess: admin => {
			editorState.clearIfMatches(admin.account.id);
		},
		statusMutation: setAdminActiveMutation,
	});

	const backendFilteredAdmins = useMemo(
		() =>
			filterAdminsByBackendFilters(
				adminsSearchQuery.data?.content ?? [],
				appliedFilters,
			),
		[adminsSearchQuery.data, appliedFilters],
	);
	const filteredAdmins = useMemo(
		() =>
			filterAdminsByFrontendFilters(backendFilteredAdmins, {
				campusFilters: frontendCampusFilters,
				query: deferredFrontendQuerySearch,
			}),
		[backendFilteredAdmins, deferredFrontendQuerySearch, frontendCampusFilters],
	);
	const columns = useMemo(() => createAdminColumns(t), [t]);
	const hasAnyFilters = Boolean(
		frontendQuerySearch.trim() ||
		frontendCampusFilters.length > 0 ||
		hasAppliedFilters,
	);
	const filterSummary = useMemo(
		() =>
			getAdminFilterSummary(
				t,
				{
					campusFilters: frontendCampusFilters,
					query: deferredFrontendQuerySearch,
				},
				appliedFilters,
			),
		[appliedFilters, deferredFrontendQuerySearch, frontendCampusFilters, t],
	);
	const emptyStateCopy = useMemo(
		() => getAdminEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		if (adminsSearchQuery.isError) {
			return (
				<SomeErrorState
					title={t("identity.adminPage.table.error.title")}
					description={t("identity.adminPage.table.error.description")}
					onRefresh={() => {
						void adminsSearchQuery.refetch();
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
	}, [adminsSearchQuery, emptyStateCopy, t]);

	const totalElements = adminsPagination.isAll
		? backendFilteredAdmins.length
		: (adminsSearchQuery.data?.totalElements ?? 0);
	const totalPages = adminsPagination.isAll
		? 1
		: Math.max(adminsSearchQuery.data?.totalPages ?? 1, 1);
	const adminsCurrentPage = adminsPagination.currentPage;
	const adminsAreShowingAll = adminsPagination.isAll;
	const setAdminsCurrentPage = adminsPagination.setCurrentPage;

	useEffect(() => {
		if (
			adminsAreShowingAll ||
			!adminsSearchQuery.data ||
			adminsCurrentPage <= totalPages
		) {
			return;
		}

		setAdminsCurrentPage(totalPages);
	}, [
		adminsAreShowingAll,
		adminsCurrentPage,
		adminsSearchQuery.data,
		setAdminsCurrentPage,
		totalPages,
	]);

	useQueryErrorToasts([
		{
			key: "admins-list",
			error: adminsSearchQuery.error,
			errorUpdatedAt: adminsSearchQuery.errorUpdatedAt,
			getContent: error => getAdminsListErrorToastContent(t, error),
			isError: adminsSearchQuery.isError,
		},
	]);

	function clearAllFilters() {
		setFrontendQuerySearch("");
		setFrontendCampusFilters([]);
		clearFilters();
		adminsPagination.resetPage();
		setBackendFiltersOpen(false);
	}

	async function handleDuplicate(admin: AdminSearchResponse) {
		try {
			const adminDetail = await getAdmin(admin.account.id);
			const linkedUser = await getUser(adminDetail.accountResponse.userId);

			createAdminMutation.mutate(
				{
					body: {
						cpfString: linkedUser.cpf,
						name: linkedUser.name,
						emailString: appendCopyToEmail(
							admin.account.email,
							(accountsQuery.data ?? []).map(account => account.email),
						),
						campus: admin.campus.campus,
					},
				},
				{
					onSuccess: () => {
						toast.success(
							t("identity.adminPage.duplicate.feedback.success.title"),
							{
								description: t(
									"identity.adminPage.duplicate.feedback.success.description",
									{
										name: linkedUser.name,
										email: appendCopyToEmail(
											admin.account.email,
											(accountsQuery.data ?? []).map(account => account.email),
										),
									},
								),
							},
						);
					},
					onError: error => {
						const { title, description } = getAdminDuplicateErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
		} catch (error) {
			const { title, description } = getAdminDuplicateErrorToastContent(
				t,
				error,
			);
			toast.danger(title, { description });
		}
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("identity.adminPage.title")}
				description={t("identity.adminPage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t("common.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("common.filters.clear")}
						createLabel={t("identity.adminPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-2"
			>
				<AdminsFilters
					backendFilters={draftFilters}
					backendFiltersOpen={backendFiltersOpen}
					frontendCampusFilters={frontendCampusFilters}
					frontendQuerySearch={frontendQuerySearch}
					hasBackendFilters={hasAppliedFilters}
					onApplyBackendFilters={() => {
						adminsPagination.resetPage();
						applyDraftFilters();
						setBackendFiltersOpen(false);
					}}
					onBackendFilterChange={(key, value) => {
						setDraftFilter(key, value);
					}}
					onBackendFiltersOpenChange={setBackendFiltersOpen}
					onClearBackendFilters={() => {
						clearFilters();
						adminsPagination.resetPage();
						setBackendFiltersOpen(false);
					}}
					onFrontendCampusFiltersChange={setFrontendCampusFilters}
					onFrontendQuerySearchChange={setFrontendQuerySearch}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<AdminSearchResponse>
				footer={
					<ServicePagePagination
						currentPage={adminsPagination.currentPage}
						pageSize={adminsPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={adminsPagination.setCurrentPage}
						onPageSizeChange={adminsPagination.setPageSize}
						disabled={adminsSearchQuery.isLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredAdmins,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<AdminsRowActions
							admin={row}
							canDeactivate={
								row.account.id !== currentAdminQuery.data?.accountResponse.id
							}
							href={`/identity/admins/${row.account.id}`}
							onDelete={setPendingDeleteRecord}
							onDuplicate={handleDuplicate}
							onSetActive={(admin, active) =>
								setPendingStatusRecord({ active, record: admin })
							}
							onOpenEditor={editorState.openEditor}
						/>
					),
					isLoading: adminsSearchQuery.isLoading,
					loadingLabel: t("identity.adminPage.loading.list"),
				}}
			/>

			<AdminsUpdateDrawer
				adminId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<RecordActionDialogs
				cancelLabel={t("common.cancel")}
				{...(pendingDeleteRecord
					? {
							deleteDialog: {
								actionLabel: t("common.table.actions.delete"),
								description: t(
									"identity.adminPage.delete.confirm.description",
									{
										name: pendingDeleteRecord.account.user.name,
									},
								),
								onAction: confirmDelete,
								onOpenChange: open => {
									if (!open) {
										setPendingDeleteRecord(null);
									}
								},
								open: true,
								title: t("identity.adminPage.delete.confirm.title"),
								variant: "danger" as const,
							},
						}
					: {})}
				{...(pendingStatusRecord
					? {
							statusDialog: {
								actionLabel: t(
									pendingStatusRecord.active
										? "common.table.actions.reactivate"
										: "common.table.actions.deactivate",
								),
								description: t(
									pendingStatusRecord.active
										? "identity.adminPage.reactivate.confirm.description"
										: "identity.adminPage.deactivate.confirm.description",
									{
										name: pendingStatusRecord.record.account.user.name,
									},
								),
								onAction: confirmStatusChange,
								onOpenChange: open => {
									if (!open) {
										setPendingStatusRecord(null);
									}
								},
								open: true,
								title: t(
									pendingStatusRecord.active
										? "identity.adminPage.reactivate.confirm.title"
										: "identity.adminPage.deactivate.confirm.title",
								),
								variant: pendingStatusRecord.active
									? ("success" as const)
									: ("warning" as const),
							},
						}
					: {})}
			/>
		</ServicePageShell>
	);
}
