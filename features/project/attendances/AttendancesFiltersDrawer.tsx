"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	AsyncComboboxFilterField,
	DateRangeFilterFields,
} from "@/components/composite";
import { ServicePageFiltersDrawer } from "@/components/composite";
import { Combobox, Input, Label } from "@/components/primitives";
import { getAttendanceStatusOptions } from "@/features/project/attendances/utils";
import type { AttendanceStatus } from "@/types/api";
import type { AttendancesFiltersDrawerProps } from "@/types/client";

export function AttendancesFiltersDrawer({
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
	onRefreshValidators,
	open,
	projectOptions,
	projectsError,
	validatorOptions,
	validatorsError,
}: AttendancesFiltersDrawerProps) {
	const { t } = useTranslation();
	const statusOptions = useMemo(() => getAttendanceStatusOptions(t), [t]);

	return (
		<ServicePageFiltersDrawer
			activeLabel={t("common.filters.active")}
			applyLabel={t("common.filters.apply")}
			clearConfirmDescription={t(
				"project.attendancePage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"project.attendancePage.filters.drawer.clearConfirm.title",
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
				label={t("project.attendancePage.filters.student.label")}
				options={formerStudentOptions}
				values={filters.formerStudentIds}
				onValuesChange={value => onFilterChange("formerStudentIds", value)}
				placeholder={t("project.attendancePage.filters.student.placeholder")}
				searchPlaceholder={t(
					"project.attendancePage.filters.student.searchPlaceholder",
				)}
				emptyMessage={t("project.attendancePage.filters.student.emptyMessage")}
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
						onFilterChange("statuses", value as AttendanceStatus[])
					}
					placeholder={t("common.placeholders.select")}
					searchPlaceholder={t(
						"project.attendancePage.filters.status.searchPlaceholder",
					)}
					emptyMessage={t("project.attendancePage.filters.status.emptyMessage")}
				/>
			</div>

			<AsyncComboboxFilterField
				multiple
				label={t("project.attendancePage.filters.validator.label")}
				options={validatorOptions}
				values={filters.validatedByIds}
				onValuesChange={value => onFilterChange("validatedByIds", value)}
				placeholder={t("common.placeholders.select")}
				searchPlaceholder={t(
					"project.attendancePage.filters.validator.searchPlaceholder",
				)}
				emptyMessage={t(
					"project.attendancePage.filters.validator.emptyMessage",
				)}
				isError={Boolean(validatorsError)}
				errorTitle={t("project.attendancePage.filters.validator.error.title")}
				errorDescription={t(
					"project.attendancePage.filters.validator.error.description",
				)}
				onRefreshError={onRefreshValidators}
			/>

			<div className="grid gap-2">
				<Label htmlFor="attendance-duration-from">
					{t("project.attendancePage.filters.durationFrom.label")}
				</Label>
				<Input
					id="attendance-duration-from"
					inputMode="numeric"
					value={filters.durationFrom}
					onChange={event => onFilterChange("durationFrom", event.target.value)}
					placeholder={t(
						"project.attendancePage.filters.durationFrom.placeholder",
					)}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="attendance-duration-to">
					{t("project.attendancePage.filters.durationTo.label")}
				</Label>
				<Input
					id="attendance-duration-to"
					inputMode="numeric"
					value={filters.durationTo}
					onChange={event => onFilterChange("durationTo", event.target.value)}
					placeholder={t(
						"project.attendancePage.filters.durationTo.placeholder",
					)}
				/>
			</div>

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
