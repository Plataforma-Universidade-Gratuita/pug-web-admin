"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import { EntitiesFiltersDrawer } from "@/features/partner/entities/EntitiesFiltersDrawer";
import { EntitiesRowActions } from "@/features/partner/entities/EntitiesRowActions";
import { EntityEditorDrawer } from "@/features/partner/entities/EntityEditorDrawer";
import { useRemoveEntityMutation } from "@/features/partner/entities/mutations";
import {
	useEntitiesQuery,
	useEntityCitiesQuery,
	useEntitiesSearchQuery,
} from "@/features/partner/entities/queries";
import {
	buildEntityCityOptions,
	createEntityColumns,
	filterEntitiesByBackendFilters,
	filterEntitiesByFrontendQuery,
	getEntitiesListErrorToastContent,
	getEntityCitiesErrorToastContent,
	getEntityDeleteErrorToastContent,
	getEntityEmptyStateCopy,
	getEntityFilterSummary,
	mapEntitiesToTableRows,
	mapEntitySearchResponsesToTableRows,
} from "@/features/partner/entities/utils";
import {
	NumberFieldFilter,
	ServicePageConfirmDialog,
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageEditorState,
	useServicePagePagination,
} from "@/hooks";
import type {
	EntityEditorMode,
	EntityTableRow,
	UseEntitiesSearchQueryFilters,
} from "@/types";

export function EntitiesPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [cnpjSearch, setCnpjSearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<UseEntitiesSearchQueryFilters>(
		() => ({
			cityIdsFilter: [],
			dateFrom: "",
			dateTo: "",
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
	} = useDraftFilters<UseEntitiesSearchQueryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const entitiesPagination = useServicePagePagination({
		key: "partner.entities",
	});
	const editorState = useServicePageEditorState<EntityEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingDeleteEntity, setPendingDeleteEntity] = useState<Pick<
		EntityTableRow,
		"id" | "name"
	> | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const deferredCnpjSearch = useDeferredValue(cnpjSearch.trim());
	const entitiesQuery = useEntitiesQuery(entitiesPagination.isAll);
	const entitiesSearchQuery = useEntitiesSearchQuery(
		entitiesPagination.backendPage ?? 0,
		entitiesPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters,
		!entitiesPagination.isAll,
	);
	const citiesQuery = useEntityCitiesQuery();
	const removeEntityMutation = useRemoveEntityMutation();
	const { schedule } = useDeferredUndoAction();

	const cityById = useMemo(
		() => new Map((citiesQuery.data ?? []).map(city => [city.id, city])),
		[citiesQuery.data],
	);
	const cityOptions = useMemo(
		() => buildEntityCityOptions(citiesQuery.data ?? []),
		[citiesQuery.data],
	);
	const backendFilteredAllEntities = useMemo(
		() =>
			filterEntitiesByBackendFilters(
				mapEntitiesToTableRows(entitiesQuery.data ?? [], cityById),
				appliedFilters,
			),
		[appliedFilters, cityById, entitiesQuery.data],
	);
	const tableSourceEntities = useMemo(
		() =>
			entitiesPagination.isAll
				? backendFilteredAllEntities
				: mapEntitySearchResponsesToTableRows(
						entitiesSearchQuery.data?.content ?? [],
					),
		[
			backendFilteredAllEntities,
			entitiesPagination.isAll,
			entitiesSearchQuery.data,
		],
	);
	const filteredEntities = useMemo(
		() =>
			filterEntitiesByFrontendQuery(tableSourceEntities, {
				cnpjQuery: deferredCnpjSearch,
				query: deferredQuerySearch,
			}),
		[deferredCnpjSearch, deferredQuerySearch, tableSourceEntities],
	);
	const columns = useMemo(() => createEntityColumns(t), [t]);
	const hasAnyFilters = Boolean(
		querySearch.trim() || cnpjSearch.trim() || hasAppliedFilters,
	);
	const filterSummary = useMemo(
		() =>
			getEntityFilterSummary(t, {
				cnpjQuery: deferredCnpjSearch,
				query: deferredQuerySearch,
				dateFrom: appliedFilters.dateFrom,
				dateTo: appliedFilters.dateTo,
			}),
		[appliedFilters, deferredCnpjSearch, deferredQuerySearch, t],
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
						if (entitiesPagination.isAll) {
							void entitiesQuery.refetch();
							return;
						}

						void entitiesSearchQuery.refetch();
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
		entitiesPagination.isAll,
		entitiesQuery,
		entitiesSearchQuery,
		t,
	]);

	const activeQuery = entitiesPagination.isAll
		? entitiesQuery
		: entitiesSearchQuery;
	const totalElements = entitiesPagination.isAll
		? backendFilteredAllEntities.length
		: (entitiesSearchQuery.data?.totalElements ?? 0);
	const totalPages = entitiesPagination.isAll
		? 1
		: Math.max(entitiesSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			entitiesPagination.isAll ||
			!entitiesSearchQuery.data ||
			entitiesPagination.currentPage <= totalPages
		) {
			return;
		}

		entitiesPagination.setCurrentPage(totalPages);
	}, [entitiesPagination, entitiesSearchQuery.data, totalPages]);

	useQueryErrorToasts([
		{
			key: "entities-list",
			error: activeQuery.error,
			errorUpdatedAt: activeQuery.errorUpdatedAt,
			getContent: error => getEntitiesListErrorToastContent(t, error),
			isError: activeQuery.isError,
		},
		{
			key: "entity-cities",
			error: citiesQuery.error,
			errorUpdatedAt: citiesQuery.errorUpdatedAt,
			getContent: error => getEntityCitiesErrorToastContent(t, error),
			isError: citiesQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		setCnpjSearch("");
		clearDraftFilters();
		entitiesPagination.resetPage();
		setFiltersOpen(false);
	}

	function handleDeleteConfirm() {
		if (!pendingDeleteEntity) {
			return;
		}

		const entity = pendingDeleteEntity;
		setPendingDeleteEntity(null);

		schedule({
			key: entity.id,
			title: t("partner.entityPage.delete.undo.title"),
			description: t("partner.entityPage.delete.undo.description", {
				name: entity.name,
			}),
			undoLabel: t("partner.entityPage.delete.undo.action"),
			onCommit: () => {
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

							editorState.clearIfMatches(entity.id);
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
			},
		});
	}

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("partner.entityPage.title")}
				description={t("partner.entityPage.description")}
				metadata={{
					triggerLabel: t("partner.entityPage.metadata.trigger"),
					emptyTitle: t("partner.entityPage.metadata.empty.title"),
					emptyDescription: t("partner.entityPage.metadata.empty.description"),
				}}
				actions={
					<ServicePageHeaderActions
						clearLabel={t("partner.entityPage.filters.clear")}
						createLabel={t("partner.entityPage.create.open")}
						hasFilters={hasAnyFilters}
						onClear={clearAllFilters}
						onCreate={editorState.openCreate}
					/>
				}
				filtersClassName="grid gap-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)_auto] lg:items-end"
			>
				<TextFieldFilter
					label={t("partner.entityPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("partner.entityPage.filters.search.placeholder")}
				/>
				<NumberFieldFilter
					label={t("partner.entityPage.filters.frontend.cnpj.label")}
					value={cnpjSearch}
					onChange={setCnpjSearch}
					placeholder={t("partner.entityPage.filters.frontend.cnpj.placeholder")}
				/>

				<EntitiesFiltersDrawer
					citiesError={citiesQuery.isError}
					cityIdsFilter={draftFilters.cityIdsFilter}
					cityOptions={cityOptions}
					endDate={draftFilters.dateTo}
					hasActiveFilters={hasAppliedFilters}
					isCitiesLoading={citiesQuery.isLoading}
					onApply={() => {
						entitiesPagination.resetPage();
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onCityIdsChange={value => setDraftFilter("cityIdsFilter", value)}
					onClear={clearAllFilters}
					onEndDateChange={value => setDraftFilter("dateTo", value)}
					onOpenChange={setFiltersOpen}
					onRefreshCities={() => {
						void citiesQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("dateFrom", value)}
					open={filtersOpen}
					startDate={draftFilters.dateFrom}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<EntityTableRow>
				footer={
					<ServicePagePagination
						currentPage={entitiesPagination.currentPage}
						pageSize={entitiesPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={entitiesPagination.setCurrentPage}
						onPageSizeChange={entitiesPagination.setPageSize}
						disabled={activeQuery.isLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredEntities,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<EntitiesRowActions
							entity={row}
							href={`/partner/entities/${row.id}`}
							onDelete={setPendingDeleteEntity}
							onOpenEditor={editorState.openEditor}
						/>
					),
					isLoading: activeQuery.isLoading,
					loadingLabel: t("partner.entityPage.loading.list"),
				}}
			/>

			<EntityEditorDrawer
				entityId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<ServicePageConfirmDialog
				open={pendingDeleteEntity !== null}
				onOpenChange={open => {
					if (!open) {
						setPendingDeleteEntity(null);
					}
				}}
				variant="danger"
				title={t("partner.entityPage.delete.confirm.title")}
				description={t("partner.entityPage.delete.confirm.description", {
					name: pendingDeleteEntity?.name ?? "",
				})}
				cancelLabel={t("common.cancel")}
				actionLabel={t("partner.entityPage.table.actions.delete")}
				onAction={handleDeleteConfirm}
			/>
		</ServicePageShell>
	);
}
