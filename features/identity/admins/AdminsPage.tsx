"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { get as getAdmin } from "@/api/web/identity/admins";
import { get as getUser } from "@/api/web/identity/users";
import { NoContentState, SomeErrorState, toast } from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { AdminsActionDialogs } from "@/features/identity/admins/AdminActionDialogs";
import { AdminsFilters } from "@/features/identity/admins/AdminsFilters";
import { AdminsRowActions } from "@/features/identity/admins/AdminsRowActions";
import { AdminsUpdateDrawer } from "@/features/identity/admins/AdminsUpdateDrawer";
import {
	useCreateAdminMutation,
	useRemoveAdminMutation,
	useSetAdminActiveMutation,
} from "@/features/identity/admins/mutations";
import {
	useAdminsSearchQuery,
	useCurrentAdminQuery,
} from "@/features/identity/admins/queries";
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
	useDeferredUndoAction,
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
	const [pendingStatusAdmin, setPendingStatusAdmin] = useState<{
		active: boolean;
		admin: AdminSearchResponse;
	} | null>(null);
	const [pendingDeleteAdmin, setPendingDeleteAdmin] =
		useState<AdminSearchResponse | null>(null);
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
	const currentAdminQuery = useCurrentAdminQuery();
	const createAdminMutation = useCreateAdminMutation();
	const setAdminActiveMutation = useSetAdminActiveMutation();
	const removeAdminMutation = useRemoveAdminMutation();
	const { schedule } = useDeferredUndoAction();

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
						emailString: appendCopyToEmail(admin.account.email),
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
										email: appendCopyToEmail(admin.account.email),
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

	function handleStatusChangeConfirm() {
		if (!pendingStatusAdmin) {
			return;
		}

		const { active, admin } = pendingStatusAdmin;
		const isCurrentAdmin =
			currentAdminQuery.data?.accountResponse.id === admin.account.id;

		if (!active && isCurrentAdmin) {
			setPendingStatusAdmin(null);
			return;
		}

		setAdminActiveMutation.mutate(
			{
				active,
				id: admin.account.id,
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
									name: admin.account.user.name,
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
		setPendingDeleteAdmin(null);

		schedule({
			key: admin.account.id,
			title: t("identity.adminPage.delete.undo.title"),
			description: t("identity.adminPage.delete.undo.description", {
				name: admin.account.user.name,
			}),
			undoLabel: t("identity.adminPage.delete.undo.action"),
			onCommit: () => {
				removeAdminMutation.mutate(
					{
						accountId: admin.account.id,
						userId: admin.account.user.id,
					},
					{
						onSuccess: () => {
							toast.success(
								t("identity.adminPage.delete.feedback.success.title"),
								{
									description: t(
										"identity.adminPage.delete.feedback.success.description",
										{
											name: admin.account.user.name,
										},
									),
								},
							);

							editorState.clearIfMatches(admin.account.id);
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
			},
		});
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("identity.adminPage.title")}
				description={t("identity.adminPage.description")}
				metadata={{
					triggerLabel: t("identity.adminPage.metadata.trigger"),
					emptyTitle: t("identity.adminPage.metadata.empty.title"),
					emptyDescription: t("identity.adminPage.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("identity.adminPage.filters.clear")}
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
							onDelete={setPendingDeleteAdmin}
							onDuplicate={handleDuplicate}
							onSetActive={(admin, active) =>
								setPendingStatusAdmin({ active, admin })
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

			<AdminsActionDialogs
				onConfirmDelete={handleDeleteConfirm}
				onConfirmStatusChange={handleStatusChangeConfirm}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteAdmin(null);
					}
				}}
				onStatusOpenChange={open => {
					if (!open) {
						setPendingStatusAdmin(null);
					}
				}}
				pendingDeleteAdmin={pendingDeleteAdmin}
				pendingStatusAdmin={pendingStatusAdmin}
			/>
		</ServicePageShell>
	);
}
