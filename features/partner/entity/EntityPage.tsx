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
import { useDeferredUndoAction, useQueryErrorToast } from "@/hooks";
import type { EntityResponse } from "@/types/api";
import type {
	EntityAuditDateField,
	EntityEditorMode,
} from "@/types/client/partner";

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
			entitiesQuery.data,
			startDate,
		],
	);
	const columns = useMemo(
		() => createEntityColumns(t, cityById),
		[cityById, t],
	);
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

	useQueryErrorToast({
		error: entitiesQuery.error,
		errorUpdatedAt: entitiesQuery.errorUpdatedAt,
		getContent: error => getEntitiesListErrorToastContent(t, error),
		isError: entitiesQuery.isError,
	});
	useQueryErrorToast({
		error: citiesQuery.error,
		errorUpdatedAt: citiesQuery.errorUpdatedAt,
		getContent: error => getEntityCitiesErrorToastContent(t, error),
		isError: citiesQuery.isError,
	});
	useQueryErrorToast({
		error: entityDetailQuery.error,
		errorUpdatedAt: entityDetailQuery.errorUpdatedAt,
		getContent: error => getEntityDetailErrorToastContent(t, error),
		isError: entityDetailQuery.isError,
	});

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
			},
		});
	}

	function openEditor(id: string, mode: EntityEditorMode) {
		window.setTimeout(() => {
			setEditorState({ id, mode });
		}, 0);
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
						onCreate={() => setEditorState({ id: null, mode: "create" })}
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
					cityIdFilter={draftCityIdFilter}
					cityOptions={cityOptions}
					dateField={draftDateField}
					endDate={draftEndDate}
					hasActiveFilters={hasSecondaryFilters}
					isCitiesLoading={citiesQuery.isLoading}
					onApply={applySecondaryFilters}
					onCityIdChange={setDraftCityIdFilter}
					onClear={clearAllFilters}
					onDateFieldChange={setDraftDateField}
					onEndDateChange={setDraftEndDate}
					onOpenChange={setFiltersOpen}
					onRefreshCities={() => {
						void citiesQuery.refetch();
					}}
					onStartDateChange={setDraftStartDate}
					open={filtersOpen}
					startDate={draftStartDate}
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
							onOpenEditor={openEditor}
							onView={setSelectedEntityId}
						/>
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

			<EntityDetailDialog
				cityById={cityById}
				entity={entityDetailQuery.data}
				error={entityDetailQuery.error}
				isError={entityDetailQuery.isError}
				isLoading={entityDetailQuery.isLoading}
				onOpenChange={open => {
					if (!open) {
						setSelectedEntityId(null);
					}
				}}
				onRefresh={() => {
					void entityDetailQuery.refetch();
				}}
				open={selectedEntityId !== null}
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
