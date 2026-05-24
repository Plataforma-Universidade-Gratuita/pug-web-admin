"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState, toast } from "@/components";
import { EntityDetailDialog } from "@/features/partner/entity/EntityDetailDialog";
import { EntityEditorDrawer } from "@/features/partner/entity/EntityEditorDrawer";
import { EntityFiltersDrawer } from "@/features/partner/entity/EntityFiltersDrawer";
import { EntityRowActions } from "@/features/partner/entity/EntityRowActions";
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
} from "@/features/partner/entity/utils";
import {
	ServicePageConfirmDialog,
	ServicePageHeader,
	ServicePageHeaderActions,
	ServicePageShell,
	ServicePageTableSection,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import {
	useDeferredUndoAction,
	useDraftFilters,
	useQueryErrorToasts,
	useServicePageDetailState,
	useServicePageEditorState,
} from "@/hooks";
import type { EntityResponse } from "@/types/api";
import type {
	EntityEditorMode,
	EntitySecondaryFilters,
} from "@/types/client/partner";

export function EntityPage() {
	const { t } = useTranslation();
	const [querySearch, setQuerySearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const initialSecondaryFilters = useMemo<EntitySecondaryFilters>(
		() => ({
			cityIdFilter: "",
			dateField: "",
			startDate: "",
			endDate: "",
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
	} = useDraftFilters<EntitySecondaryFilters>({
		initialFilters: initialSecondaryFilters,
	});
	const detailState = useServicePageDetailState();
	const editorState = useServicePageEditorState<EntityEditorMode>({
		createMode: "create",
		defaultMode: "update",
	});
	const [pendingDeleteEntity, setPendingDeleteEntity] =
		useState<EntityResponse | null>(null);
	const deferredQuerySearch = useDeferredValue(querySearch.trim());
	const entitiesQuery = useEntitiesQuery();
	const citiesQuery = useEntityCitiesQuery();
	const entityDetailQuery = useEntityDetailQuery(detailState.selectedId);
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
	const filteredEntities = useMemo(
		() =>
			filterEntities(entitiesQuery.data ?? [], {
				query: deferredQuerySearch,
				cityIdFilter: appliedFilters.cityIdFilter,
				dateField: appliedFilters.dateField,
				startDate: appliedFilters.startDate,
				endDate: appliedFilters.endDate,
				cityById,
			}),
		[appliedFilters, cityById, deferredQuerySearch, entitiesQuery.data],
	);
	const columns = useMemo(
		() => createEntityColumns(t, cityById),
		[cityById, t],
	);
	const hasAnyFilters = Boolean(querySearch.trim() || hasAppliedFilters);
	const filterSummary = useMemo(
		() =>
			getEntityFilterSummary(t, {
				query: deferredQuerySearch,
				cityIdFilter: appliedFilters.cityIdFilter,
				dateField: appliedFilters.dateField,
				startDate: appliedFilters.startDate,
				endDate: appliedFilters.endDate,
				cityById,
			}),
		[appliedFilters, cityById, deferredQuerySearch, t],
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

	useQueryErrorToasts([
		{
			key: "entities-list",
			error: entitiesQuery.error,
			errorUpdatedAt: entitiesQuery.errorUpdatedAt,
			getContent: error => getEntitiesListErrorToastContent(t, error),
			isError: entitiesQuery.isError,
		},
		{
			key: "entity-cities",
			error: citiesQuery.error,
			errorUpdatedAt: citiesQuery.errorUpdatedAt,
			getContent: error => getEntityCitiesErrorToastContent(t, error),
			isError: citiesQuery.isError,
		},
		{
			key: "entity-detail",
			error: entityDetailQuery.error,
			errorUpdatedAt: entityDetailQuery.errorUpdatedAt,
			getContent: error => getEntityDetailErrorToastContent(t, error),
			isError: entityDetailQuery.isError,
		},
	]);

	function clearAllFilters() {
		setQuerySearch("");
		clearDraftFilters();
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

							detailState.clearIfMatches(entity.id);
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
				filtersClassName="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_auto]"
			>
				<TextFieldFilter
					label={t("partner.entityPage.filters.search.label")}
					value={querySearch}
					onChange={setQuerySearch}
					placeholder={t("partner.entityPage.filters.search.placeholder")}
				/>

				<EntityFiltersDrawer
					citiesError={citiesQuery.isError}
					cityIdFilter={draftFilters.cityIdFilter}
					cityOptions={cityOptions}
					dateField={draftFilters.dateField}
					endDate={draftFilters.endDate}
					hasActiveFilters={hasAppliedFilters}
					isCitiesLoading={citiesQuery.isLoading}
					onApply={() => {
						applyDraftFilters();
						setFiltersOpen(false);
					}}
					onCityIdChange={value => setDraftFilter("cityIdFilter", value)}
					onClear={clearAllFilters}
					onDateFieldChange={value => setDraftFilter("dateField", value)}
					onEndDateChange={value => setDraftFilter("endDate", value)}
					onOpenChange={setFiltersOpen}
					onRefreshCities={() => {
						void citiesQuery.refetch();
					}}
					onStartDateChange={value => setDraftFilter("startDate", value)}
					open={filtersOpen}
					startDate={draftFilters.startDate}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<EntityResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredEntities,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<EntityRowActions
							entity={row}
							onDelete={setPendingDeleteEntity}
							onOpenEditor={editorState.openEditor}
							onView={detailState.openDetail}
						/>
					),
					isLoading: entitiesQuery.isLoading,
					loadingLabel: t("partner.entityPage.loading.list"),
				}}
			/>

			<EntityEditorDrawer
				entityId={editorState.editorId}
				mode={editorState.editorMode}
				open={editorState.isOpen}
				onOpenChange={editorState.handleOpenChange}
			/>

			<EntityDetailDialog
				cityById={cityById}
				entity={entityDetailQuery.data}
				error={entityDetailQuery.error}
				isError={entityDetailQuery.isError}
				isLoading={entityDetailQuery.isLoading}
				onOpenChange={detailState.handleOpenChange}
				onRefresh={() => {
					void entityDetailQuery.refetch();
				}}
				open={detailState.isOpen}
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
