"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Combobox, DatePicker, SomeErrorState } from "@/components";
import { getProjectStatusOptions } from "@/features/project/projects/utils";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { ProjectsFiltersDrawerProps, ProjectStatus } from "@/types";

export function ProjectsFiltersDrawer({
	adminsError,
	createdByIds,
	creatorOptions,
	dateFrom,
	dateTo,
	entitiesError,
	entityIds,
	entityOptions,
	hasActiveFilters,
	onApply,
	onCreatedByIdsChange,
	onClear,
	onDateFromChange,
	onDateToChange,
	onEntityIdsChange,
	onOpenChange,
	onRefreshAdmins,
	onRefreshEntities,
	onStatusesChange,
	open,
	statuses,
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
			<div className="grid gap-4 sm:grid-cols-2">
				{entitiesError ? (
					<SomeErrorState
						title={t("project.projectPage.filters.entity.error.title")}
						description={t(
							"project.projectPage.filters.entity.error.description",
						)}
						onRefresh={onRefreshEntities}
					/>
				) : (
					<div className="grid gap-2">
						<p className="field-label">
							{t("project.projectPage.filters.entity.label")}
						</p>
						<Combobox
							multiple
							options={entityOptions}
							values={entityIds}
							onValuesChange={value => onEntityIdsChange(value)}
							placeholder={t("project.projectPage.filters.entity.placeholder")}
							searchPlaceholder={t(
								"project.projectPage.filters.entity.searchPlaceholder",
							)}
							emptyMessage={t(
								"project.projectPage.filters.entity.emptyMessage",
							)}
						/>
					</div>
				)}

				{adminsError ? (
					<SomeErrorState
						title={t("project.projectPage.filters.createdBy.error.title")}
						description={t(
							"project.projectPage.filters.createdBy.error.description",
						)}
						onRefresh={onRefreshAdmins}
					/>
				) : (
					<div className="grid gap-2">
						<p className="field-label">
							{t("project.projectPage.filters.createdBy.label")}
						</p>
						<Combobox
							multiple
							options={creatorOptions}
							values={createdByIds}
							onValuesChange={value => onCreatedByIdsChange(value)}
							placeholder={t(
								"project.projectPage.filters.createdBy.placeholder",
							)}
							searchPlaceholder={t(
								"project.projectPage.filters.createdBy.searchPlaceholder",
							)}
							emptyMessage={t(
								"project.projectPage.filters.createdBy.emptyMessage",
							)}
						/>
					</div>
				)}
			</div>

			<div className="grid gap-2">
				<p className="field-label">
					{t("project.projectPage.filters.status.label")}
				</p>
				<Combobox
					multiple
					options={statusOptions}
					values={statuses}
					onValuesChange={value => onStatusesChange(value as ProjectStatus[])}
					placeholder={t("project.projectPage.filters.status.placeholder")}
				/>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<p className="field-label">
						{t("project.projectPage.filters.startDate.label")}
					</p>
					<DatePicker
						value={dateFrom}
						onValueChange={onDateFromChange}
						placeholder={t("project.projectPage.filters.startDate.placeholder")}
					/>
				</div>

				<div className="grid gap-2">
					<p className="field-label">
						{t("project.projectPage.filters.endDate.label")}
					</p>
					<DatePicker
						value={dateTo}
						onValueChange={onDateToChange}
						placeholder={t("project.projectPage.filters.endDate.placeholder")}
					/>
				</div>
			</div>
		</ServicePageFiltersDrawer>
	);
}
