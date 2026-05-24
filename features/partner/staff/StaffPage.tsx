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
import { useQueryErrorToast } from "@/hooks";
import type { StaffResponse } from "@/types/api";
import type {
	StaffActiveFilter,
	StaffEditorMode,
} from "@/types/client/partner";

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
	const {
		confirmDelete,
		confirmStatusChange,
		pendingDeleteStaff,
		pendingStatusStaff,
		setPendingDeleteStaff,
		setPendingStatusStaff,
	} = useStaffPageActions({
		currentEditorId: editorState?.id ?? null,
		currentSelectedId: selectedStaffId,
		onClearEditor: () => setEditorState(null),
		onClearSelection: () => setSelectedStaffId(null),
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
				entityIdFilter,
				cityIdFilter,
				activeFilter,
			}),
		[
			activeFilter,
			cityIdFilter,
			deferredQuerySearch,
			entityIdFilter,
			staffQuery.data,
		],
	);
	const columns = useMemo(() => createStaffColumns(t), [t]);
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

	useQueryErrorToast({
		error: staffQuery.error,
		errorUpdatedAt: staffQuery.errorUpdatedAt,
		getContent: error => getStaffListErrorToastContent(t, error),
		isError: staffQuery.isError,
	});
	useQueryErrorToast({
		error: staffDetailQuery.error,
		errorUpdatedAt: staffDetailQuery.errorUpdatedAt,
		getContent: error => getStaffDetailErrorToastContent(t, error),
		isError: staffDetailQuery.isError,
	});
	useQueryErrorToast({
		error: linkedAccountQuery.error,
		errorUpdatedAt: linkedAccountQuery.errorUpdatedAt,
		getContent: error => getLinkedStaffAccountErrorToastContent(t, error),
		isError: linkedAccountQuery.isError,
	});
	useQueryErrorToast({
		error: linkedUserQuery.error,
		errorUpdatedAt: linkedUserQuery.errorUpdatedAt,
		getContent: error => getLinkedStaffUserErrorToastContent(t, error),
		isError: linkedUserQuery.isError,
	});
	useQueryErrorToast({
		error: staffCitiesQuery.error,
		errorUpdatedAt: staffCitiesQuery.errorUpdatedAt,
		getContent: error => getStaffCitiesErrorToastContent(t, error),
		isError: staffCitiesQuery.isError,
	});
	useQueryErrorToast({
		error: staffEntitiesQuery.error,
		errorUpdatedAt: staffEntitiesQuery.errorUpdatedAt,
		getContent: error => getStaffEntitiesErrorToastContent(t, error),
		isError: staffEntitiesQuery.isError,
	});

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

	function openEditor(id: string, mode: StaffEditorMode) {
		window.setTimeout(() => {
			setEditorState({ id, mode });
		}, 0);
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
						onCreate={() => setEditorState({ id: null, mode: "create" })}
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
					activeFilter={draftActiveFilter}
					citiesError={staffCitiesQuery.isError}
					cityIdFilter={draftCityIdFilter}
					cityOptions={cityOptions}
					entitiesError={staffEntitiesQuery.isError}
					entityIdFilter={draftEntityIdFilter}
					entityOptions={entityOptions}
					hasActiveFilters={hasSecondaryFilters}
					isCitiesLoading={staffCitiesQuery.isLoading}
					isEntitiesLoading={staffEntitiesQuery.isLoading}
					onActiveFilterChange={setDraftActiveFilter}
					onApply={applySecondaryFilters}
					onCityIdChange={setDraftCityIdFilter}
					onClear={clearAllFilters}
					onEntityIdChange={setDraftEntityIdFilter}
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
							onOpenEditor={openEditor}
							onSetActive={(staff, active) =>
								setPendingStatusStaff({ active, staff })
							}
							onView={setSelectedStaffId}
							staff={row}
						/>
					),
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
				onOpenChange={open => {
					if (!open) {
						setSelectedStaffId(null);
					}
				}}
				onRefresh={() => {
					void staffDetailQuery.refetch();
				}}
				open={selectedStaffId !== null}
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
