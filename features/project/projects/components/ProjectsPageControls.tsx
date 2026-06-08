"use client";

import { useTranslation } from "react-i18next";

import {
	ServicePageConfirmDialog,
	TextFieldFilter,
} from "@/components/composite";
import { Combobox, Label } from "@/components/primitives";
import { ProjectsFiltersDrawer } from "@/features/project/projects/ProjectsFiltersDrawer";
import { getProjectStatusDialogVariant } from "@/features/project/projects/components/utils";
import { getCrudDeleteConfirmCopy } from "@/features/utils";
import type { ProjectResponse, ProjectStatus } from "@/types/api";
import type {
	ComboboxOption,
	ProjectComplexSearchFilters,
	ProjectStatusAction,
} from "@/types/client";

export function ProjectsPageFilters({
	querySearch,
	onQuerySearchChange,
	frontendStatuses,
	onFrontendStatusesChange,
	statusOptions,
	draftFilters,
	filtersOpen,
	hasAppliedFilters,
	entityOptions,
	creatorOptions,
	entitiesError,
	creatorsError,
	onApply,
	onClear,
	onCreatedByIdsChange,
	onDateFromChange,
	onDateToChange,
	onDescriptionChange,
	onEntityIdsChange,
	onMaxOfferedHoursChange,
	onMinOfferedHoursChange,
	onNameChange,
	onOpenChange,
	onRefreshCreators,
	onRefreshEntities,
	onStatusesChange,
}: {
	querySearch: string;
	onQuerySearchChange: (value: string) => void;
	frontendStatuses: ProjectStatus[];
	onFrontendStatusesChange: (value: ProjectStatus[]) => void;
	statusOptions: ComboboxOption[];
	draftFilters: ProjectComplexSearchFilters;
	filtersOpen: boolean;
	hasAppliedFilters: boolean;
	entityOptions: ComboboxOption[];
	creatorOptions: ComboboxOption[];
	entitiesError: boolean;
	creatorsError: boolean;
	onApply: () => void;
	onClear: () => void;
	onCreatedByIdsChange: (value: string[]) => void;
	onDateFromChange: (value: string) => void;
	onDateToChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onEntityIdsChange: (value: string[]) => void;
	onMaxOfferedHoursChange: (value: string) => void;
	onMinOfferedHoursChange: (value: string) => void;
	onNameChange: (value: string) => void;
	onOpenChange: (open: boolean) => void;
	onRefreshCreators: () => void;
	onRefreshEntities: () => void;
	onStatusesChange: (value: ProjectStatus[]) => void;
}) {
	const { t } = useTranslation();

	return (
		<>
			<TextFieldFilter
				label={t("common.filters.search.label")}
				value={querySearch}
				onChange={onQuerySearchChange}
				placeholder={t("common.filters.search.placeholder")}
			/>

			<div className="grid gap-2">
				<Label>{t("common.fields.status")}</Label>
				<Combobox
					multiple
					options={statusOptions}
					values={frontendStatuses}
					onValuesChange={value =>
						onFrontendStatusesChange(value as ProjectStatus[])
					}
					placeholder="Select..."
					maxVisibleValues={1}
				/>
			</div>

			<ProjectsFiltersDrawer
				creatorsError={creatorsError}
				createdByIds={draftFilters.createdByIds}
				creatorOptions={creatorOptions}
				dateFrom={draftFilters.dateFrom}
				dateTo={draftFilters.dateTo}
				description={draftFilters.description}
				entitiesError={entitiesError}
				entityIds={draftFilters.entityIds}
				entityOptions={entityOptions}
				hasActiveFilters={hasAppliedFilters}
				onApply={onApply}
				onCreatedByIdsChange={onCreatedByIdsChange}
				onClear={onClear}
				onDateFromChange={onDateFromChange}
				onDateToChange={onDateToChange}
				onDescriptionChange={onDescriptionChange}
				onEntityIdsChange={onEntityIdsChange}
				onMaxOfferedHoursChange={onMaxOfferedHoursChange}
				onMinOfferedHoursChange={onMinOfferedHoursChange}
				onNameChange={onNameChange}
				onOpenChange={onOpenChange}
				onRefreshCreators={onRefreshCreators}
				onRefreshEntities={onRefreshEntities}
				onStatusesChange={onStatusesChange}
				open={filtersOpen}
				statuses={draftFilters.statuses}
				maxOfferedHours={draftFilters.maxOfferedHours}
				minOfferedHours={draftFilters.minOfferedHours}
				name={draftFilters.name}
			/>
		</>
	);
}

export function ProjectsPageDialogs({
	pendingDeleteProject,
	pendingStatusAction,
	onDeleteOpenChange,
	onStatusOpenChange,
	onDeleteConfirm,
	onStatusConfirm,
}: {
	pendingDeleteProject: ProjectResponse | null;
	pendingStatusAction: {
		action: ProjectStatusAction;
		project: ProjectResponse;
	} | null;
	onDeleteOpenChange: (open: boolean) => void;
	onStatusOpenChange: (open: boolean) => void;
	onDeleteConfirm: () => void;
	onStatusConfirm: () => void;
}) {
	const { t } = useTranslation();
	const deleteConfirmCopy = pendingDeleteProject
		? getCrudDeleteConfirmCopy(
				t,
				t("common.objects.project"),
				pendingDeleteProject.name,
			)
		: null;

	return (
		<>
			<ServicePageConfirmDialog
				open={pendingDeleteProject !== null}
				onOpenChange={onDeleteOpenChange}
				variant="danger"
				title={deleteConfirmCopy?.title ?? ""}
				description={deleteConfirmCopy?.description ?? ""}
				cancelLabel={t("common.cancel")}
				actionLabel={t("table.actions.delete")}
				onAction={onDeleteConfirm}
			/>

			<ServicePageConfirmDialog
				open={pendingStatusAction !== null}
				onOpenChange={onStatusOpenChange}
				variant={
					pendingStatusAction
						? getProjectStatusDialogVariant(pendingStatusAction.action)
						: "success"
				}
				title={
					pendingStatusAction
						? t(
								`project.projectPage.${pendingStatusAction.action}.confirm.title`,
							)
						: ""
				}
				description={
					pendingStatusAction
						? t(
								`project.projectPage.${pendingStatusAction.action}.confirm.description`,
								{
									name: pendingStatusAction.project.name,
								},
							)
						: ""
				}
				cancelLabel={t("common.cancel")}
				actionLabel={
					pendingStatusAction
						? t(
								`project.projectPage.table.actions.${pendingStatusAction.action}`,
							)
						: ""
				}
				onAction={onStatusConfirm}
			/>
		</>
	);
}
