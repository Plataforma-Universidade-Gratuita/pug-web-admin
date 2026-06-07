"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	AsyncComboboxFilterField,
	DateRangeFilterFields,
} from "@/components/composite";
import { ServicePageFiltersDrawer } from "@/components/composite";
import { NumberFieldFilter, TextFieldFilter } from "@/components/composite";
import { Combobox, Label } from "@/components/primitives";
import { getProjectStatusOptions } from "@/features/project/projects/utils";
import type { ProjectStatus } from "@/types/api";
import type { ProjectsFiltersDrawerProps } from "@/types/client";

export function ProjectsFiltersDrawer({
	creatorsError,
	createdByIds,
	creatorOptions,
	dateFrom,
	dateTo,
	description,
	entitiesError,
	entityIds,
	entityOptions,
	hasActiveFilters,
	onApply,
	onCreatedByIdsChange,
	onClear,
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
	open,
	statuses,
	maxOfferedHours,
	minOfferedHours,
	name,
}: ProjectsFiltersDrawerProps) {
	const { t } = useTranslation();
	const statusOptions = useMemo(() => getProjectStatusOptions(t), [t]);

	return (
		<ServicePageFiltersDrawer
			activeLabel={t("common.filters.active")}
			applyLabel={t("common.filters.apply")}
			clearConfirmDescription={t(
				"project.projectPage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"project.projectPage.filters.drawer.clearConfirm.title",
			)}
			clearLabel={t("common.filters.clear")}
			hasActiveFilters={hasActiveFilters}
			label={t("common.filters.label")}
			onApply={onApply}
			onClear={onClear}
			onOpenChange={onOpenChange}
			open={open}
			overhead={t("common.filters.overhead")}
			title={t("common.filters.title")}
			triggerLabel={t("common.filters.more")}
		>
			<TextFieldFilter
				label={t("project.projectPage.filters.name.label")}
				value={name}
				onChange={onNameChange}
				placeholder={t("project.projectPage.filters.name.placeholder")}
			/>

			<AsyncComboboxFilterField
				multiple
				label={t("common.fields.entity")}
				options={entityOptions}
				values={entityIds}
				onValuesChange={value => onEntityIdsChange(value)}
				placeholder={t("common.placeholders.select")}
				searchPlaceholder={t("common.placeholders.search")}
				emptyMessage={t("common.placeholders.noResults")}
				isError={Boolean(entitiesError)}
				errorTitle={t("common.loadErrors.entities.title")}
				errorDescription={t("common.loadErrors.entities.description")}
				onRefreshError={onRefreshEntities}
			/>

			<TextFieldFilter
				label={t("project.projectPage.filters.description.label")}
				value={description}
				onChange={onDescriptionChange}
				placeholder={t("project.projectPage.filters.description.placeholder")}
			/>

			<AsyncComboboxFilterField
				multiple
				label={t("project.projectPage.filters.createdBy.label")}
				options={creatorOptions}
				values={createdByIds}
				onValuesChange={value => onCreatedByIdsChange(value)}
				placeholder={t("project.projectPage.filters.createdBy.placeholder")}
				searchPlaceholder={t(
					"project.projectPage.filters.createdBy.searchPlaceholder",
				)}
				emptyMessage={t("project.projectPage.filters.createdBy.emptyMessage")}
				isError={Boolean(creatorsError)}
				errorTitle={t("project.projectPage.filters.createdBy.error.title")}
				errorDescription={t(
					"project.projectPage.filters.createdBy.error.description",
				)}
				onRefreshError={onRefreshCreators}
			/>

			<div className="grid gap-2">
				<Label>{t("common.fields.status")}</Label>
				<Combobox
					multiple
					options={statusOptions}
					values={statuses}
					onValuesChange={value => onStatusesChange(value as ProjectStatus[])}
					placeholder={t("common.placeholders.select")}
				/>
			</div>

			<NumberFieldFilter
				label={t("project.projectPage.filters.maxOfferedHours.label")}
				value={maxOfferedHours}
				onChange={onMaxOfferedHoursChange}
				placeholder={t(
					"project.projectPage.filters.maxOfferedHours.placeholder",
				)}
			/>

			<NumberFieldFilter
				label={t("project.projectPage.filters.minOfferedHours.label")}
				value={minOfferedHours}
				onChange={onMinOfferedHoursChange}
				placeholder={t(
					"project.projectPage.filters.minOfferedHours.placeholder",
				)}
			/>

			<DateRangeFilterFields
				startLabel={t("common.filters.startDate.label")}
				startValue={dateFrom}
				onStartValueChange={onDateFromChange}
				startPlaceholder={t("common.filters.startDate.placeholder")}
				endLabel={t("common.filters.endDate.label")}
				endValue={dateTo}
				onEndValueChange={onDateToChange}
				endPlaceholder={t("common.filters.endDate.placeholder")}
			/>
		</ServicePageFiltersDrawer>
	);
}
