"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	Combobox,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SomeErrorState,
} from "@/components";
import { getProjectStatusOptions } from "@/features/project/projects/utils";
import {
	AuditInfoFilterFields,
	ServicePageFiltersDrawer,
} from "@/features/shared/service-pages";
import type {
	ProjectAuditDateField,
	ProjectsFiltersDrawerProps,
	ProjectStatusFilter,
} from "@/types";

export function ProjectsFiltersDrawer({
	adminsError,
	createdByFilter,
	creatorOptions,
	dateField,
	endDate,
	entitiesError,
	entityIdFilter,
	entityOptions,
	hasActiveFilters,
	onApply,
	onCreatedByFilterChange,
	onClear,
	onDateFieldChange,
	onEndDateChange,
	onEntityIdFilterChange,
	onOpenChange,
	onRefreshAdmins,
	onRefreshEntities,
	onStartDateChange,
	onStatusFilterChange,
	open,
	startDate,
	statusFilter,
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
							options={entityOptions}
							value={entityIdFilter}
							onValueChange={onEntityIdFilterChange}
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
							options={creatorOptions}
							value={createdByFilter}
							onValueChange={onCreatedByFilterChange}
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
				<Select
					value={statusFilter}
					onValueChange={value =>
						onStatusFilterChange(value as ProjectStatusFilter)
					}
				>
					<SelectTrigger
						className="w-full"
						placeholder={t("project.projectPage.filters.status.placeholder")}
					/>
					<SelectContent>
						{statusOptions.map(option => (
							<SelectItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<AuditInfoFilterFields
				dateFieldLabel={t("project.projectPage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"project.projectPage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as ProjectAuditDateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t("project.projectPage.filters.dateField.options.createdAt"),
					},
					{
						value: "updatedAt",
						label: t("project.projectPage.filters.dateField.options.updatedAt"),
					},
				]}
				startDateLabel={t("project.projectPage.filters.startDate.label")}
				startDatePlaceholder={t(
					"project.projectPage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("project.projectPage.filters.endDate.label")}
				endDatePlaceholder={t(
					"project.projectPage.filters.endDate.placeholder",
				)}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
