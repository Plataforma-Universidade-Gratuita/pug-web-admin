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
import { getAttendanceStatusOptions } from "@/features/project/attendance/utils";
import {
	AuditInfoFilterFields,
	ServicePageFiltersDrawer,
} from "@/features/shared/service-pages";
import type {
	AttendanceAuditDateField,
	AttendanceFiltersDrawerProps,
	AttendanceStatusFilter,
} from "@/types/client/project";

export function AttendanceFiltersDrawer({
	dateField,
	endDate,
	hasActiveFilters,
	onApply,
	onClear,
	onDateFieldChange,
	onEndDateChange,
	onOpenChange,
	onProjectIdFilterChange,
	onRefreshProjects,
	onRefreshStudents,
	onStartDateChange,
	onStatusFilterChange,
	onStudentIdFilterChange,
	open,
	projectIdFilter,
	projectOptions,
	projectsError,
	startDate,
	statusFilter,
	studentIdFilter,
	studentOptions,
	studentsError,
}: AttendanceFiltersDrawerProps) {
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
			<div className="grid gap-4 sm:grid-cols-2">
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
						<p className="field-label">
							{t("project.attendancePage.filters.project.label")}
						</p>
						<Combobox
							options={projectOptions}
							value={projectIdFilter}
							onValueChange={onProjectIdFilterChange}
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

				{studentsError ? (
					<SomeErrorState
						title={t("project.attendancePage.filters.student.error.title")}
						description={t(
							"project.attendancePage.filters.student.error.description",
						)}
						onRefresh={onRefreshStudents}
					/>
				) : (
					<div className="grid gap-2">
						<p className="field-label">
							{t("project.attendancePage.filters.student.label")}
						</p>
						<Combobox
							options={studentOptions}
							value={studentIdFilter}
							onValueChange={onStudentIdFilterChange}
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
			</div>

			<div className="grid gap-2">
				<p className="field-label">
					{t("project.attendancePage.filters.status.label")}
				</p>
				<Select
					value={statusFilter}
					onValueChange={value =>
						onStatusFilterChange(value as AttendanceStatusFilter)
					}
				>
					<SelectTrigger
						className="w-full"
						placeholder={t("project.attendancePage.filters.status.placeholder")}
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
				dateFieldLabel={t("project.attendancePage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"project.attendancePage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as AttendanceAuditDateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t(
							"project.attendancePage.filters.dateField.options.createdAt",
						),
					},
					{
						value: "updatedAt",
						label: t(
							"project.attendancePage.filters.dateField.options.updatedAt",
						),
					},
				]}
				startDateLabel={t("project.attendancePage.filters.startDate.label")}
				startDatePlaceholder={t(
					"project.attendancePage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("project.attendancePage.filters.endDate.label")}
				endDatePlaceholder={t(
					"project.attendancePage.filters.endDate.placeholder",
				)}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
