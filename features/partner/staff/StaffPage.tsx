"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { get as getUser } from "@/api/web/identity/users";
import { get as getStaff } from "@/api/web/partner/staff";
import { NoContentState, SomeErrorState } from "@/components";
import { toast } from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { useUsersQuery } from "@/features/identity/users/queries";
import { StaffActionDialogs } from "@/features/partner/staff/StaffActionDialogs";
import { StaffEditorDrawer } from "@/features/partner/staff/StaffEditorDrawer";
import { StaffFiltersDrawer } from "@/features/partner/staff/StaffFiltersDrawer";
import { StaffRowActions } from "@/features/partner/staff/StaffRowActions";
import { useCreateStaffMutation } from "@/features/partner/staff/mutations";
import {
	useStaffEntitiesQuery,
	useStaffSearchQuery,
	useStaffQuery,
} from "@/features/partner/staff/queries";
import { useStaffPageActions } from "@/features/partner/staff/useStaffPageActions";
import {
	buildStaffEntityOptions,
	createStaffColumns,
	filterStaffByFrontendQuery,
	filterStaffListByBackendFilters,
	getStaffDuplicateErrorToastContent,
	getStaffEmptyStateCopy,
	getStaffListErrorToastContent,
	getStaffEntitiesErrorToastContent,
	getStaffFilterSummary,
	appendCopyToEmail,
} from "@/features/partner/staff/utils";
import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
	useServicePagePagination,
} from "@/hooks";
import type {
	StaffComplexSearchFilters,
	StaffEditorMode,
	StaffSearchResponse,
} from "@/types";

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
		pendingDeleteStaff,
		pendingStatusStaff,
		setPendingDeleteStaff,
		setPendingStatusStaff,
	} = useStaffPageActions({
		currentEditorId: editorState.editorId,
		currentSelectedId: null,
		onClearEditor: editorState.closeEditor,
		onClearSelection: () => {},
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
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
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
						emailString: appendCopyToEmail(staff.account.email),
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
			<ServicePageHeader
				title={t("partner.staffPage.title")}
				description={t("partner.staffPage.description")}
				metadata={{
					triggerLabel: t("partner.staffPage.metadata.trigger"),
					emptyTitle: t("partner.staffPage.metadata.empty.title"),
					emptyDescription: t("partner.staffPage.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("partner.staffPage.filters.clear")}
						createLabel={t("partner.staffPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("partner.staffPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("partner.staffPage.filters.search.placeholder")}
				/>

				<StaffFiltersDrawer
					filters={draftFilters}
					entitiesError={staffEntitiesQuery.isError}
					entityOptions={entityOptions}
					hasActiveFilters={hasAppliedFilters}
					isEntitiesLoading={staffEntitiesQuery.isLoading}
					onApply={() => {
						staffPagination.resetPage();
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onClear={clearAllFilters}
					onFilterChange={(key, value) => setDraftFilter(key, value)}
					onOpenChange={setFiltersOpen}
					onRefreshEntities={() => {
						void staffEntitiesQuery.refetch();
					}}
					open={filtersOpen}
				/>
			</ServicePageHeader>

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
							onDelete={setPendingDeleteStaff}
							onDuplicate={handleDuplicate}
							onOpenEditor={editorState.openEditor}
							onSetActive={(staff, active) =>
								setPendingStatusStaff({ active, staff })
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

			<StaffActionDialogs
				onConfirmDelete={confirmDelete}
				onConfirmStatusChange={confirmStatusChange}
				onDeleteOpenChange={open => {
					if (!open) {
						setPendingDeleteStaff(null);
					}
				}}
				onStatusOpenChange={open => {
					if (!open) {
						setPendingStatusStaff(null);
					}
				}}
				pendingDeleteStaff={pendingDeleteStaff}
				pendingStatusStaff={pendingStatusStaff}
			/>
		</ServicePageShell>
	);
}
