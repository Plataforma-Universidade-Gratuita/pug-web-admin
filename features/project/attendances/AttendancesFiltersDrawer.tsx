"use client";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import {
	Combobox,
	DatePicker,
	Input,
	Label,
	SomeErrorState,
} from "@/components";
import { getAttendanceStatusOptions } from "@/features/project/attendances/utils";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { AttendanceStatus, AttendancesFiltersDrawerProps } from "@/types";

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
			activeLabel={t("project.attendancePage.filters.drawer.active")}
			applyLabel={t("project.attendancePage.filters.drawer.apply")}
			clearConfirmDescription={t(
				"project.attendancePage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"project.attendancePage.filters.drawer.clearConfirm.title",
			)}
			clearLabel={t("project.attendancePage.filters.clear")}
			hasActiveFilters={hasActiveFilters}
			label={t("project.attendancePage.filters.drawer.label")}
			onApply={onApply}
			onClear={onClear}
			onOpenChange={onOpenChange}
			open={open}
			overhead={t("project.attendancePage.filters.drawer.overhead")}
			title={t("project.attendancePage.filters.drawer.title")}
			triggerLabel={t("project.attendancePage.filters.drawer.trigger")}
		>
			{projectsError ? (
				<SomeErrorState
					title={t("project.attendancePage.filters.project.error.title")}
					description={t(
						"project.attendancePage.filters.project.error.description",
					)}
					onRefresh={onRefreshProjects}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("project.attendancePage.filters.project.label")}</Label>
					<Combobox
						multiple
						options={projectOptions}
						values={filters.projectIds}
						onValuesChange={value => onFilterChange("projectIds", value)}
						placeholder={t(
							"project.attendancePage.filters.project.placeholder",
						)}
						searchPlaceholder={t(
							"project.attendancePage.filters.project.searchPlaceholder",
						)}
						emptyMessage={t(
							"project.attendancePage.filters.project.emptyMessage",
						)}
					/>
				</div>
			)}

			{formerStudentsError ? (
				<SomeErrorState
					title={t("project.attendancePage.filters.student.error.title")}
					description={t(
						"project.attendancePage.filters.student.error.description",
					)}
					onRefresh={onRefreshFormerStudents}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("project.attendancePage.filters.student.label")}</Label>
					<Combobox
						multiple
						options={formerStudentOptions}
						values={filters.formerStudentIds}
						onValuesChange={value => onFilterChange("formerStudentIds", value)}
						placeholder={t(
							"project.attendancePage.filters.student.placeholder",
						)}
						searchPlaceholder={t(
							"project.attendancePage.filters.student.searchPlaceholder",
						)}
						emptyMessage={t(
							"project.attendancePage.filters.student.emptyMessage",
						)}
					/>
				</div>
			)}

			<div className="grid gap-2">
				<Label>{t("project.attendancePage.filters.status.label")}</Label>
				<Combobox
					multiple
					options={statusOptions}
					values={filters.statuses}
					onValuesChange={value =>
						onFilterChange("statuses", value as AttendanceStatus[])
					}
					placeholder={t("project.attendancePage.filters.status.placeholder")}
					searchPlaceholder={t(
						"project.attendancePage.filters.status.searchPlaceholder",
					)}
					emptyMessage={t("project.attendancePage.filters.status.emptyMessage")}
				/>
			</div>

			{validatorsError ? (
				<SomeErrorState
					title={t("project.attendancePage.filters.validator.error.title")}
					description={t(
						"project.attendancePage.filters.validator.error.description",
					)}
					onRefresh={onRefreshValidators}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("project.attendancePage.filters.validator.label")}</Label>
					<Combobox
						multiple
						options={validatorOptions}
						values={filters.validatedByIds}
						onValuesChange={value => onFilterChange("validatedByIds", value)}
						placeholder={t(
							"project.attendancePage.filters.validator.placeholder",
						)}
						searchPlaceholder={t(
							"project.attendancePage.filters.validator.searchPlaceholder",
						)}
						emptyMessage={t(
							"project.attendancePage.filters.validator.emptyMessage",
						)}
					/>
				</div>
			)}

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

			<div className="grid gap-2">
				<Label>{t("project.attendancePage.filters.startDate.label")}</Label>
				<DatePicker
					value={filters.dateFrom}
					onValueChange={value => onFilterChange("dateFrom", value)}
					placeholder={t(
						"project.attendancePage.filters.startDate.placeholder",
					)}
				/>
			</div>

			<div className="grid gap-2">
				<Label>{t("project.attendancePage.filters.endDate.label")}</Label>
				<DatePicker
					value={filters.dateTo}
					onValueChange={value => onFilterChange("dateTo", value)}
					placeholder={t("project.attendancePage.filters.endDate.placeholder")}
				/>
			</div>
		</ServicePageFiltersDrawer>
	);
}
