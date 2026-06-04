"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Combobox, DatePicker, Label, SomeErrorState } from "@/components";
import { getProjectStatusOptions } from "@/features/project/projects/utils";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import {
	NumberFieldFilter,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { ProjectsFiltersDrawerProps, ProjectStatus } from "@/types";

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
			activeLabel={t("project.projectPage.filters.drawer.active")}
			applyLabel={t("project.projectPage.filters.drawer.apply")}
			clearConfirmDescription={t(
				"project.projectPage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"project.projectPage.filters.drawer.clearConfirm.title",
			)}
			clearLabel={t("project.projectPage.filters.clear")}
			hasActiveFilters={hasActiveFilters}
			label={t("project.projectPage.filters.drawer.label")}
			onApply={onApply}
			onClear={onClear}
			onOpenChange={onOpenChange}
			open={open}
			overhead={t("project.projectPage.filters.drawer.overhead")}
			title={t("project.projectPage.filters.drawer.title")}
			triggerLabel={t("project.projectPage.filters.drawer.trigger")}
		>
			<TextFieldFilter
				label={t("project.projectPage.filters.name.label")}
				value={name}
				onChange={onNameChange}
				placeholder={t("project.projectPage.filters.name.placeholder")}
			/>

			{entitiesError ? (
				<SomeErrorState
					title={t("project.projectPage.filters.entity.error.title")}
					description={t("project.projectPage.filters.entity.error.description")}
					onRefresh={onRefreshEntities}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("project.projectPage.filters.entity.label")}</Label>
					<Combobox
						multiple
						options={entityOptions}
						values={entityIds}
						onValuesChange={value => onEntityIdsChange(value)}
						placeholder={t("project.projectPage.filters.entity.placeholder")}
						searchPlaceholder={t(
							"project.projectPage.filters.entity.searchPlaceholder",
						)}
						emptyMessage={t("project.projectPage.filters.entity.emptyMessage")}
					/>
				</div>
			)}

			<TextFieldFilter
				label={t("project.projectPage.filters.description.label")}
				value={description}
				onChange={onDescriptionChange}
				placeholder={t("project.projectPage.filters.description.placeholder")}
			/>

			{creatorsError ? (
				<SomeErrorState
					title={t("project.projectPage.filters.createdBy.error.title")}
					description={t(
						"project.projectPage.filters.createdBy.error.description",
					)}
					onRefresh={onRefreshCreators}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("project.projectPage.filters.createdBy.label")}</Label>
					<Combobox
						multiple
						options={creatorOptions}
						values={createdByIds}
						onValuesChange={value => onCreatedByIdsChange(value)}
						placeholder={t("project.projectPage.filters.createdBy.placeholder")}
						searchPlaceholder={t(
							"project.projectPage.filters.createdBy.searchPlaceholder",
						)}
						emptyMessage={t(
							"project.projectPage.filters.createdBy.emptyMessage",
						)}
					/>
				</div>
			)}

			<div className="grid gap-2">
				<Label>{t("project.projectPage.filters.status.label")}</Label>
				<Combobox
					multiple
					options={statusOptions}
					values={statuses}
					onValuesChange={value => onStatusesChange(value as ProjectStatus[])}
					placeholder={t("project.projectPage.filters.status.placeholder")}
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

			<div className="grid min-w-0 gap-2">
				<Label>{t("project.projectPage.filters.startDate.label")}</Label>
				<DatePicker
					value={dateFrom}
					onValueChange={onDateFromChange}
					placeholder={t("project.projectPage.filters.startDate.placeholder")}
				/>
			</div>

			<div className="grid min-w-0 gap-2">
				<Label>{t("project.projectPage.filters.endDate.label")}</Label>
				<DatePicker
					value={dateTo}
					onValueChange={onDateToChange}
					placeholder={t("project.projectPage.filters.endDate.placeholder")}
				/>
			</div>
		</ServicePageFiltersDrawer>
	);
}
