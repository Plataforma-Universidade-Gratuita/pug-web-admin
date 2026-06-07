"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import {
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/components/composite";
import { NoContentState, SomeErrorState, toast } from "@/components/primitives";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { StaffEditorDrawer } from "@/features/partner/staff/StaffEditorDrawer";
import { StaffRowActions } from "@/features/partner/staff/StaffRowActions";
import { StaffPageDialogs } from "@/features/partner/staff/components/StaffPageDialogs";
import { StaffPageFilters } from "@/features/partner/staff/components/StaffPageFilters";
import {
	buildStaffEntityOptions,
	createStaffColumns,
	filterStaffByFrontendQuery,
	filterStaffListByBackendFilters,
	getStaffDeleteErrorToastContent,
	getStaffDuplicateErrorToastContent,
	getStaffEmptyStateCopy,
	getStaffListErrorToastContent,
	getStaffEntitiesErrorToastContent,
	getStaffFilterSummary,
	getStaffSetActiveErrorToastContent,
	appendCopyToEmail,
} from "@/features/partner/staff/utils";
import {
	useActivatableRecordActions,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
	useServicePagePagination,
} from "@/hooks";
import type { StaffSearchResponse } from "@/types/api";
import type {
	StaffComplexSearchFilters,
	StaffEditorMode,
} from "@/types/client";

const { accounts: accountsApi, users: usersApi } = web.identity;
const { staff: staffApi } = web.partner;
const { useAccountsQuery } = accountsApi;
const { get: getUser, useUsersQuery } = usersApi;
const {
	get: getStaff,
	useCreateStaffMutation,
	useRemoveStaffMutation,
	useSetStaffActiveMutation,
	useStaffEntitiesQuery,
	useStaffSearchQuery,
	useStaffQuery,
} = staffApi;

export function StaffPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialFilters = useMemo<StaffComplexSearchFilters>(
		() => ({
			name: "",
			cpf: "",
			email: "",
			dateFrom: "",
			dateTo: "",
			activeOnly: true,
			entityIds: [],
		}),
		[],
	);
	const {
		appliedFilters,
		applyDraftFilters,
		clearFilters: clearDraftFilters,
		draftFilters,
		hasAppliedFilters,
		setDraftFilter,
	} = useDraftFilters<StaffComplexSearchFilters>({
		initialFilters,
	});
	const staffPagination = useServicePagePagination({
		key: "partner.staff",
	});
	const editorState = useServicePageEditorState<StaffEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const staffQuery = useStaffQuery(staffPagination.isAll);
	const accountsQuery = useAccountsQuery();
	const usersQuery = useUsersQuery(staffPagination.isAll);
	const staffSearchQuery = useStaffSearchQuery(
		staffPagination.backendPage ?? 0,
		staffPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!staffPagination.isAll,
	);
	const staffEntitiesQuery = useStaffEntitiesQuery();
	const createStaffMutation = useCreateStaffMutation();
	const {
		confirmDelete,
		confirmStatusChange,
		pendingDeleteRecord,
		pendingStatusRecord,
		setPendingDeleteRecord,
		setPendingStatusRecord,
	} = useActivatableRecordActions<
		StaffSearchResponse,
		{ id: string; active: boolean },
		{ accountId: string; userId: string }
	>({
		deleteMutation: useRemoveStaffMutation(),
		getDeleteErrorToastContent: error =>
			getStaffDeleteErrorToastContent(t, error),
		getDeleteSuccessToastContent: staff => ({
			title: t("partner.staffPage.delete.feedback.success.title"),
			description: t("partner.staffPage.delete.feedback.success.description", {
				name: staff.account.user.name,
			}),
		}),
		getDeleteUndoToastContent: staff => ({
			key: staff.account.id,
			title: t("partner.staffPage.delete.undo.title"),
			description: t("partner.staffPage.delete.undo.description", {
				name: staff.account.user.name,
			}),
			undoLabel: t("common.actions.undo"),
		}),
		getDeleteVariables: staff => ({
			accountId: staff.account.id,
			userId: staff.account.user.id,
		}),
		getStatusErrorToastContent: (error, _staff, active) =>
			getStaffSetActiveErrorToastContent(t, error, active),
		getStatusSuccessToastContent: (staff, active) => ({
			title: t(
				active
					? "partner.staffPage.reactivate.feedback.success.title"
					: "partner.staffPage.deactivate.feedback.success.title",
			),
			description: t(
				active
					? "partner.staffPage.reactivate.feedback.success.description"
					: "partner.staffPage.deactivate.feedback.success.description",
				{
					name: staff.account.user.name,
				},
			),
		}),
		getStatusVariables: (staff, active) => ({
			id: staff.account.id,
			active,
		}),
		onDeleteSuccess: staff => {
			editorState.clearIfMatches(staff.account.id);
		},
		statusMutation: useSetStaffActiveMutation(),
	});
	const userById = useMemo(
		() => new Map((usersQuery.data ?? []).map(user => [user.id, user])),
		[usersQuery.data],
	);
	const entityById = useMemo(
		() =>
			new Map(
				(staffEntitiesQuery.data ?? []).map(entity => [entity.id, entity]),
			),
		[staffEntitiesQuery.data],
	);
	const entityOptions = useMemo(
		() => buildStaffEntityOptions(staffEntitiesQuery.data ?? []),
		[staffEntitiesQuery.data],
	);
	const backendFilteredAllStaff = useMemo(
		() =>
			filterStaffListByBackendFilters(
				staffQuery.data ?? [],
				userById,
				entityById,
				appliedFilters,
			),
		[appliedFilters, entityById, staffQuery.data, userById],
	);
	const tableSourceStaff = useMemo(
		() =>
			staffPagination.isAll
				? backendFilteredAllStaff
				: (staffSearchQuery.data?.content ?? []),
		[backendFilteredAllStaff, staffPagination.isAll, staffSearchQuery.data],
	);
	const filteredStaff = useMemo(
		() => filterStaffByFrontendQuery(tableSourceStaff, deferredQuerySearch),
		[deferredQuerySearch, tableSourceStaff],
	);
	const columns = useMemo(() => createStaffColumns(t), [t]);
	const filterSummary = useMemo(
		() =>
			getStaffFilterSummary(t, {
				query: deferredQuerySearch,
				entityById,
				entityIds: appliedFilters.entityIds,
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
				activeOnly: appliedFilters.activeOnly,
			}),
		[appliedFilters, deferredQuerySearch, entityById, t],
	);
	const emptyStateCopy = useMemo(
		() => getStaffEmptyStateCopy(t, filterSummary),
		[filterSummary, t],
	);
	const tableEmptyState = useMemo(() => {
		const activeQueryIsError = staffPagination.isAll
			? staffQuery.isError || usersQuery.isError
			: staffSearchQuery.isError;

		if (activeQueryIsError) {
			return (
				<SomeErrorState
					title={t("partner.staffPage.table.error.title")}
					description={t("partner.staffPage.table.error.description")}
					onRefresh={() => {
						if (staffPagination.isAll) {
							void Promise.all([staffQuery.refetch(), usersQuery.refetch()]);
							return;
						}

						void staffSearchQuery.refetch();
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
	}, [
		emptyStateCopy.description,
		emptyStateCopy.title,
		staffPagination.isAll,
		staffQuery,
		staffSearchQuery,
		t,
		usersQuery,
	]);

	const activeQueryError = staffPagination.isAll
		? (staffQuery.error ?? usersQuery.error)
		: staffSearchQuery.error;
	const activeQueryErrorUpdatedAt = staffPagination.isAll
		? Math.max(staffQuery.errorUpdatedAt, usersQuery.errorUpdatedAt)
		: staffSearchQuery.errorUpdatedAt;
	const activeQueryIsError = staffPagination.isAll
		? staffQuery.isError || usersQuery.isError
		: staffSearchQuery.isError;
	const activeQueryIsLoading = staffPagination.isAll
		? staffQuery.isLoading || usersQuery.isLoading
		: staffSearchQuery.isLoading;
	const totalElements = staffPagination.isAll
		? backendFilteredAllStaff.length
		: (staffSearchQuery.data?.totalElements ?? 0);
	const totalPages = staffPagination.isAll
		? 1
		: Math.max(staffSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			staffPagination.isAll ||
			!staffSearchQuery.data ||
			staffPagination.currentPage <= totalPages
		) {
			return;
		}

		staffPagination.setCurrentPage(totalPages);
	}, [staffPagination, staffSearchQuery.data, totalPages]);

	useQueryErrorToasts([
		{
			key: "staff-list",
			error: activeQueryError,
			errorUpdatedAt: activeQueryErrorUpdatedAt,
			getContent: error => getStaffListErrorToastContent(t, error),
			isError: activeQueryIsError,
		},
		{
			key: "staff-entities",
			error: staffEntitiesQuery.error,
			errorUpdatedAt: staffEntitiesQuery.errorUpdatedAt,
			getContent: error => getStaffEntitiesErrorToastContent(t, error),
			isError: staffEntitiesQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
		staffPagination.resetPage();
		setFiltersOpen(false);
	}

	async function handleDuplicate(staff: StaffSearchResponse) {
		try {
			const staffDetail = await getStaff(staff.account.id);
			const linkedUser = await getUser(staffDetail.account.userId);

			createStaffMutation.mutate(
				{
					body: {
						cpfString: linkedUser.cpf,
						name: linkedUser.name,
						emailString: appendCopyToEmail(
							staff.account.email,
							(accountsQuery.data ?? []).map(account => account.email),
						),
						entityId: staff.entity.id,
					},
				},
				{
					onSuccess: () => {
						toast.success(
							t("partner.staffPage.duplicate.feedback.success.title"),
							{
								description: t(
									"partner.staffPage.duplicate.feedback.success.description",
									{
										name: linkedUser.name,
									},
								),
							},
						);
					},
					onError: error => {
						const { title, description } = getStaffDuplicateErrorToastContent(
							t,
							error,
						);
						toast.danger(title, { description });
					},
				},
			);
		} catch (error) {
			const { title, description } = getStaffDuplicateErrorToastContent(
				t,
				error,
			);
			toast.danger(title, { description });
		}
	}

	return (
		<ServicePageShell>
			<StaffPageFilters
				entityOptions={entityOptions}
				entitiesError={staffEntitiesQuery.isError}
				filters={draftFilters}
				filtersOpen={filtersOpen}
				hasActiveFilters={hasAppliedFilters}
				isEntitiesLoading={staffEntitiesQuery.isLoading}
				onApply={() => {
					staffPagination.resetPage();
					applyDraftFilters();
					setFiltersOpen(false);
				}}
				onClear={clearAllFilters}
				onCreate={editorState.openCreate}
				onFilterChange={(key, value) => setDraftFilter(key, value)}
				onOpenChange={setFiltersOpen}
				onQuerySearchChange={setQuerySearch}
				onRefreshEntities={() => {
					void staffEntitiesQuery.refetch();
				}}
				querySearch={querySearch}
			/>

			<ServicePageTableSection<StaffSearchResponse>
				footer={
					<ServicePagePagination
						currentPage={staffPagination.currentPage}
						pageSize={staffPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={staffPagination.setCurrentPage}
						onPageSizeChange={staffPagination.setPageSize}
						disabled={activeQueryIsLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredStaff,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<StaffRowActions
							href={`/partner/staff/${row.account.id}`}
							onDelete={setPendingDeleteRecord}
							onDuplicate={handleDuplicate}
							onOpenEditor={editorState.openEditor}
							onSetActive={(staff, active) =>
								setPendingStatusRecord({ active, record: staff })
							}
							staff={row}
						/>
					),
					isLoading: activeQueryIsLoading,
					loadingLabel: t("partner.staffPage.loading.list"),
				}}
			/>

			<StaffEditorDrawer
				staffId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<StaffPageDialogs
				onDeleteConfirm={confirmDelete}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteRecord(null);
					}
				}}
				onStatusConfirm={confirmStatusChange}
				onStatusOpenChange={open => {
					if (!open) {
						setPendingStatusRecord(null);
					}
				}}
				pendingDeleteRecord={pendingDeleteRecord}
				pendingStatusRecord={pendingStatusRecord}
			/>
		</ServicePageShell>
	);
}
