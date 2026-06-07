"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	AsyncComboboxFilterField,
	DateRangeFilterFields,
} from "@/components/composite";
import { ServicePageFiltersDrawer } from "@/components/composite";
import { Combobox, Label } from "@/components/primitives";
import { getEnrollmentStatusOptions } from "@/features/project/enrollments/utils";
import type { EnrollmentStatus } from "@/types/api";
import type { EnrollmentsFiltersDrawerProps } from "@/types/client";

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
			clearConfirmDescription={t("common.filters.clearConfirm.description")}
			clearConfirmTitle={t("common.filters.clearConfirm.title")}
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
			<AsyncComboboxFilterField
				multiple
				label={t("common.fields.project")}
				options={projectOptions}
				values={filters.projectIds}
				onValuesChange={value => onFilterChange("projectIds", value)}
				placeholder={t("common.placeholders.select")}
				searchPlaceholder={t("common.placeholders.search")}
				emptyMessage={t("common.placeholders.noResults")}
				isError={Boolean(projectsError)}
				errorTitle={t("common.loadErrors.projects.title")}
				errorDescription={t("common.loadErrors.projects.description")}
				onRefreshError={onRefreshProjects}
			/>

			<AsyncComboboxFilterField
				multiple
				label={t("project.enrollmentPage.filters.student.label")}
				options={formerStudentOptions}
				values={filters.formerStudentIds}
				onValuesChange={value => onFilterChange("formerStudentIds", value)}
				placeholder={t("project.enrollmentPage.filters.student.placeholder")}
				searchPlaceholder={t(
					"project.enrollmentPage.filters.student.searchPlaceholder",
				)}
				emptyMessage={t("project.enrollmentPage.filters.student.emptyMessage")}
				isError={Boolean(formerStudentsError)}
				errorTitle={t("common.loadErrors.formerStudents.title")}
				errorDescription={t("common.loadErrors.formerStudents.description")}
				onRefreshError={onRefreshFormerStudents}
			/>

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

			<DateRangeFilterFields
				startLabel={t("project.enrollmentPage.filters.periodFrom.label")}
				startValue={filters.periodFrom}
				onStartValueChange={value => onFilterChange("periodFrom", value)}
				startPlaceholder={t(
					"project.enrollmentPage.filters.periodFrom.placeholder",
				)}
				endLabel={t("project.enrollmentPage.filters.periodTo.label")}
				endValue={filters.periodTo}
				onEndValueChange={value => onFilterChange("periodTo", value)}
				endPlaceholder={t(
					"project.enrollmentPage.filters.periodTo.placeholder",
				)}
			/>

			<DateRangeFilterFields
				startLabel={t("common.filters.startDate.label")}
				startValue={filters.dateFrom}
				onStartValueChange={value => onFilterChange("dateFrom", value)}
				startPlaceholder={t("common.filters.startDate.placeholder")}
				endLabel={t("common.filters.endDate.label")}
				endValue={filters.dateTo}
				onEndValueChange={value => onFilterChange("dateTo", value)}
				endPlaceholder={t("common.filters.endDate.placeholder")}
			/>
		</ServicePageFiltersDrawer>
	);
}
