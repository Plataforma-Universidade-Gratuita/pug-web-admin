"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { Combobox, DatePicker, Label, SomeErrorState } from "@/components";
import { getEnrollmentStatusOptions } from "@/features/project/enrollments/utils";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { EnrollmentStatus, EnrollmentsFiltersDrawerProps } from "@/types";

export function EnrollmentsFiltersDrawer({
	filters,
	formerStudentOptions,
	formerStudentsError,
	hasActiveFilters,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
	onRefreshFormerStudents,
	onRefreshProjects,
	open,
	projectOptions,
	projectsError,
}: EnrollmentsFiltersDrawerProps) {
	const { t } = useTranslation();
	const statusOptions = useMemo(() => getEnrollmentStatusOptions(t), [t]);

	return (
		<ServicePageFiltersDrawer
			activeLabel={t("common.filters.active")}
			applyLabel={t("common.filters.apply")}
			clearConfirmDescription={t(
				"project.enrollmentPage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"project.enrollmentPage.filters.drawer.clearConfirm.title",
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
			{projectsError ? (
				<SomeErrorState
					title={t("common.loadErrors.projects.title")}
					description={t("common.loadErrors.projects.description")}
					onRefresh={onRefreshProjects}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("common.fields.project")}</Label>
					<Combobox
						multiple
						options={projectOptions}
						values={filters.projectIds}
						onValuesChange={value => onFilterChange("projectIds", value)}
						placeholder={t("common.placeholders.select")}
						searchPlaceholder={t("common.placeholders.search")}
						emptyMessage={t("common.placeholders.noResults")}
					/>
				</div>
			)}

			{formerStudentsError ? (
				<SomeErrorState
					title={t("common.loadErrors.formerStudents.title")}
					description={t("common.loadErrors.formerStudents.description")}
					onRefresh={onRefreshFormerStudents}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("project.enrollmentPage.filters.student.label")}</Label>
					<Combobox
						multiple
						options={formerStudentOptions}
						values={filters.formerStudentIds}
						onValuesChange={value => onFilterChange("formerStudentIds", value)}
						placeholder={t(
							"project.enrollmentPage.filters.student.placeholder",
						)}
						searchPlaceholder={t(
							"project.enrollmentPage.filters.student.searchPlaceholder",
						)}
						emptyMessage={t(
							"project.enrollmentPage.filters.student.emptyMessage",
						)}
					/>
				</div>
			)}

			<div className="grid gap-2">
				<Label>{t("common.fields.status")}</Label>
				<Combobox
					multiple
					options={statusOptions}
					values={filters.statuses}
					onValuesChange={value =>
						onFilterChange("statuses", value as EnrollmentStatus[])
					}
					placeholder={t("common.placeholders.select")}
					searchPlaceholder={t(
						"project.enrollmentPage.filters.status.searchPlaceholder",
					)}
					emptyMessage={t("project.enrollmentPage.filters.status.emptyMessage")}
				/>
			</div>

			<div className="grid gap-2">
				<Label>{t("project.enrollmentPage.filters.periodFrom.label")}</Label>
				<DatePicker
					value={filters.periodFrom}
					onValueChange={value => onFilterChange("periodFrom", value)}
					placeholder={t(
						"project.enrollmentPage.filters.periodFrom.placeholder",
					)}
				/>
			</div>

			<div className="grid gap-2">
				<Label>{t("project.enrollmentPage.filters.periodTo.label")}</Label>
				<DatePicker
					value={filters.periodTo}
					onValueChange={value => onFilterChange("periodTo", value)}
					placeholder={t("project.enrollmentPage.filters.periodTo.placeholder")}
				/>
			</div>

			<div className="grid gap-2">
				<Label>{t("common.filters.startDate.label")}</Label>
				<DatePicker
					value={filters.dateFrom}
					onValueChange={value => onFilterChange("dateFrom", value)}
					placeholder={t("common.filters.startDate.placeholder")}
				/>
			</div>

			<div className="grid gap-2">
				<Label>{t("common.filters.endDate.label")}</Label>
				<DatePicker
					value={filters.dateTo}
					onValueChange={value => onFilterChange("dateTo", value)}
					placeholder={t("common.filters.endDate.placeholder")}
				/>
			</div>
		</ServicePageFiltersDrawer>
	);
}
