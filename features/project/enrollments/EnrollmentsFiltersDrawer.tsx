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
			activeLabel={t("project.enrollmentPage.filters.drawer.active")}
			applyLabel={t("project.enrollmentPage.filters.drawer.apply")}
			clearConfirmDescription={t(
				"project.enrollmentPage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"project.enrollmentPage.filters.drawer.clearConfirm.title",
			)}
			clearLabel={t("project.enrollmentPage.filters.clear")}
			hasActiveFilters={hasActiveFilters}
			label={t("project.enrollmentPage.filters.drawer.label")}
			onApply={onApply}
			onClear={onClear}
			onOpenChange={onOpenChange}
			open={open}
			overhead={t("project.enrollmentPage.filters.drawer.overhead")}
			title={t("project.enrollmentPage.filters.drawer.title")}
			triggerLabel={t("project.enrollmentPage.filters.drawer.trigger")}
		>
			{projectsError ? (
				<SomeErrorState
					title={t("project.enrollmentPage.filters.project.error.title")}
					description={t(
						"project.enrollmentPage.filters.project.error.description",
					)}
					onRefresh={onRefreshProjects}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("project.enrollmentPage.filters.project.label")}</Label>
					<Combobox
						multiple
						options={projectOptions}
						values={filters.projectIds}
						onValuesChange={value => onFilterChange("projectIds", value)}
						placeholder={t(
							"project.enrollmentPage.filters.project.placeholder",
						)}
						searchPlaceholder={t(
							"project.enrollmentPage.filters.project.searchPlaceholder",
						)}
						emptyMessage={t(
							"project.enrollmentPage.filters.project.emptyMessage",
						)}
					/>
				</div>
			)}

			{formerStudentsError ? (
				<SomeErrorState
					title={t("project.enrollmentPage.filters.student.error.title")}
					description={t(
						"project.enrollmentPage.filters.student.error.description",
					)}
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
				<Label>{t("project.enrollmentPage.filters.status.label")}</Label>
				<Combobox
					multiple
					options={statusOptions}
					values={filters.statuses}
					onValuesChange={value =>
						onFilterChange("statuses", value as EnrollmentStatus[])
					}
					placeholder={t("project.enrollmentPage.filters.status.placeholder")}
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
				<Label>{t("project.enrollmentPage.filters.startDate.label")}</Label>
				<DatePicker
					value={filters.dateFrom}
					onValueChange={value => onFilterChange("dateFrom", value)}
					placeholder={t(
						"project.enrollmentPage.filters.startDate.placeholder",
					)}
				/>
			</div>

			<div className="grid gap-2">
				<Label>{t("project.enrollmentPage.filters.endDate.label")}</Label>
				<DatePicker
					value={filters.dateTo}
					onValueChange={value => onFilterChange("dateTo", value)}
					placeholder={t("project.enrollmentPage.filters.endDate.placeholder")}
				/>
			</div>
		</ServicePageFiltersDrawer>
	);
}
