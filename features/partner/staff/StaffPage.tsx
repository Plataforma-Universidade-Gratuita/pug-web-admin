"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState } from "@/components";
import { StaffActionDialogs } from "@/features/partner/staff/StaffActionDialogs";
import { StaffDetailDialog } from "@/features/partner/staff/StaffDetailDialog";
import { StaffEditorDrawer } from "@/features/partner/staff/StaffEditorDrawer";
import { StaffFiltersDrawer } from "@/features/partner/staff/StaffFiltersDrawer";
import { StaffRowActions } from "@/features/partner/staff/StaffRowActions";
import {
	useLinkedStaffAccountQuery,
	useLinkedStaffUserQuery,
	useStaffCitiesQuery,
	useStaffDetailQuery,
	useStaffEntitiesQuery,
	useStaffQuery,
} from "@/features/partner/staff/queries";
import { useStaffPageActions } from "@/features/partner/staff/useStaffPageActions";
import {
	buildStaffCityOptions,
	buildStaffEntityOptions,
	createStaffColumns,
	filterStaff,
	getLinkedStaffAccountErrorToastContent,
	getLinkedStaffUserErrorToastContent,
	getStaffCitiesErrorToastContent,
	getStaffDetailErrorToastContent,
	getStaffEmptyStateCopy,
	getStaffEntitiesErrorToastContent,
	getStaffFilterSummary,
	getStaffListErrorToastContent,
} from "@/features/partner/staff/utils";
import {
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageDetailState,
	useServicePageEditorState,
} from "@/hooks";
import type { StaffResponse } from "@/types";
import type { StaffEditorMode, StaffSecondaryFilters } from "@/types";

export function StaffPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<StaffSecondaryFilters>(
		() => ({
			entityIdFilter: "",
			cityIdFilter: "",
			activeFilter: "",
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
	} = useDraftFilters<StaffSecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const detailState = useServicePageDetailState();
	const editorState = useServicePageEditorState<StaffEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const staffQuery = useStaffQuery();
	const staffCitiesQuery = useStaffCitiesQuery();
	const staffEntitiesQuery = useStaffEntitiesQuery();
	const staffDetailQuery = useStaffDetailQuery(detailState.selectedId);
	const linkedAccountQuery = useLinkedStaffAccountQuery(
		staffDetailQuery.data?.accountId ?? null,
	);
	const linkedUserQuery = useLinkedStaffUserQuery(
		staffDetailQuery.data?.userId ?? null,
	);
	const {
		confirmDelete,
		confirmStatusChange,
		pendingDeleteStaff,
		pendingStatusStaff,
		setPendingDeleteStaff,
		setPendingStatusStaff,
	} = useStaffPageActions({
		currentEditorId: editorState.editorId,
		currentSelectedId: detailState.selectedId,
		onClearEditor: editorState.closeEditor,
		onClearSelection: detailState.closeDetail,
	});

	const cityById = useMemo(
		() => new Map((staffCitiesQuery.data ?? []).map(city => [city.id, city])),
		[staffCitiesQuery.data],
	);
	const entityById = useMemo(
		() =>
			new Map(
				(staffEntitiesQuery.data ?? []).map(entity => [entity.id, entity]),
			),
		[staffEntitiesQuery.data],
	);
	const cityOptions = useMemo(
		() => buildStaffCityOptions(staffCitiesQuery.data ?? []),
		[staffCitiesQuery.data],
	);
	const entityOptions = useMemo(
		() => buildStaffEntityOptions(staffEntitiesQuery.data ?? []),
		[staffEntitiesQuery.data],
	);
	const filteredStaff = useMemo(
		() =>
			filterStaff(staffQuery.data ?? [], {
				query: deferredQuerySearch,
				entityIdFilter: appliedFilters.entityIdFilter,
				cityIdFilter: appliedFilters.cityIdFilter,
				activeFilter: appliedFilters.activeFilter,
			}),
		[appliedFilters, deferredQuerySearch, staffQuery.data],
	);
	const columns = useMemo(() => createStaffColumns(t), [t]);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getStaffFilterSummary(t, {
				query: deferredQuerySearch,
				entityIdFilter: appliedFilters.entityIdFilter,
				cityIdFilter: appliedFilters.cityIdFilter,
				activeFilter: appliedFilters.activeFilter,
				entityById,
				cityById,
			}),
		[appliedFilters, cityById, deferredQuerySearch, entityById, t],
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

	useQueryErrorToasts([
		{
			key: "staff-list",
			error: staffQuery.error,
			errorUpdatedAt: staffQuery.errorUpdatedAt,
			getContent: error => getStaffListErrorToastContent(t, error),
			isError: staffQuery.isError,
		},
		{
			key: "staff-detail",
			error: staffDetailQuery.error,
			errorUpdatedAt: staffDetailQuery.errorUpdatedAt,
			getContent: error => getStaffDetailErrorToastContent(t, error),
			isError: staffDetailQuery.isError,
		},
		{
			key: "staff-linked-account",
			error: linkedAccountQuery.error,
			errorUpdatedAt: linkedAccountQuery.errorUpdatedAt,
			getContent: error => getLinkedStaffAccountErrorToastContent(t, error),
			isError: linkedAccountQuery.isError,
		},
		{
			key: "staff-linked-user",
			error: linkedUserQuery.error,
			errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
			getContent: error => getLinkedStaffUserErrorToastContent(t, error),
			isError: linkedUserQuery.isError,
		},
		{
			key: "staff-cities",
			error: staffCitiesQuery.error,
			errorUpdatedAt: staffCitiesQuery.errorUpdatedAt,
			getContent: error => getStaffCitiesErrorToastContent(t, error),
			isError: staffCitiesQuery.isError,
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
		setFiltersOpen(false);
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
					activeFilter={draftFilters.activeFilter}
					citiesError={staffCitiesQuery.isError}
					cityIdFilter={draftFilters.cityIdFilter}
					cityOptions={cityOptions}
					entitiesError={staffEntitiesQuery.isError}
					entityIdFilter={draftFilters.entityIdFilter}
					entityOptions={entityOptions}
					hasActiveFilters={hasAppliedFilters}
					isCitiesLoading={staffCitiesQuery.isLoading}
					isEntitiesLoading={staffEntitiesQuery.isLoading}
					onActiveFilterChange={value => setDraftFilter("activeFilter", value)}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onCityIdChange={value => setDraftFilter("cityIdFilter", value)}
					onClear={clearAllFilters}
					onEntityIdChange={value => setDraftFilter("entityIdFilter", value)}
					onOpenChange={setFiltersOpen}
					onRefreshCities={() => {
						void staffCitiesQuery.refetch();
					}}
					onRefreshEntities={() => {
						void staffEntitiesQuery.refetch();
					}}
					open={filtersOpen}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<StaffResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredStaff,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<StaffRowActions
							onDelete={setPendingDeleteStaff}
							onOpenEditor={editorState.openEditor}
							onSetActive={(staff, active) =>
								setPendingStatusStaff({ active, staff })
							}
							onView={detailState.openDetail}
							staff={row}
						/>
					),
					isLoading: staffQuery.isLoading,
					loadingLabel: t("partner.staffPage.loading.list"),
				}}
			/>

			<StaffEditorDrawer
				staffId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<StaffDetailDialog
				error={staffDetailQuery.error}
				isError={staffDetailQuery.isError}
				isLoading={staffDetailQuery.isLoading}
				linkedAccount={linkedAccountQuery.data}
				linkedAccountError={linkedAccountQuery.error}
				linkedAccountIsError={linkedAccountQuery.isError}
				linkedAccountIsLoading={linkedAccountQuery.isLoading}
				linkedUser={linkedUserQuery.data}
				linkedUserError={linkedUserQuery.error}
				linkedUserIsError={linkedUserQuery.isError}
				linkedUserIsLoading={linkedUserQuery.isLoading}
				onLinkedAccountRefresh={() => {
					void linkedAccountQuery.refetch();
				}}
				onLinkedUserRefresh={() => {
					void linkedUserQuery.refetch();
				}}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void staffDetailQuery.refetch();
				}}
				open={detailState.isOpen}
				staff={staffDetailQuery.data}
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
