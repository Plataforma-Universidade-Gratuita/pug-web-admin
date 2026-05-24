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
import {
	AuditInfoFilterFields,
	ServicePageFiltersDrawer,
} from "@/features/shared/service-pages";
import { getEnrollmentStatusOptions } from "@/features/project/enrollment/utils";
import type {
	EnrollmentAuditDateField,
	EnrollmentFiltersDrawerProps,
	EnrollmentStatusFilter,
} from "@/types/client/project";

export function EnrollmentFiltersDrawer({
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
}: EnrollmentFiltersDrawerProps) {
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
			<div className="grid gap-4 sm:grid-cols-2">
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
						<p className="field-label">
							{t("project.enrollmentPage.filters.project.label")}
						</p>
						<Combobox
							options={projectOptions}
							value={projectIdFilter}
							onValueChange={onProjectIdFilterChange}
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

				{studentsError ? (
					<SomeErrorState
						title={t("project.enrollmentPage.filters.student.error.title")}
						description={t(
							"project.enrollmentPage.filters.student.error.description",
						)}
						onRefresh={onRefreshStudents}
					/>
				) : (
					<div className="grid gap-2">
						<p className="field-label">
							{t("project.enrollmentPage.filters.student.label")}
						</p>
						<Combobox
							options={studentOptions}
							value={studentIdFilter}
							onValueChange={onStudentIdFilterChange}
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
			</div>

			<div className="grid gap-2">
				<p className="field-label">
					{t("project.enrollmentPage.filters.status.label")}
				</p>
				<Select
					value={statusFilter}
					onValueChange={value =>
						onStatusFilterChange(value as EnrollmentStatusFilter)
					}
				>
					<SelectTrigger
						className="w-full"
						placeholder={t(
							"project.enrollmentPage.filters.status.placeholder",
						)}
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
				dateFieldLabel={t("project.enrollmentPage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"project.enrollmentPage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as EnrollmentAuditDateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t(
							"project.enrollmentPage.filters.dateField.options.createdAt",
						),
					},
					{
						value: "updatedAt",
						label: t(
							"project.enrollmentPage.filters.dateField.options.updatedAt",
						),
					},
				]}
				startDateLabel={t("project.enrollmentPage.filters.startDate.label")}
				startDatePlaceholder={t(
					"project.enrollmentPage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("project.enrollmentPage.filters.endDate.label")}
				endDatePlaceholder={t(
					"project.enrollmentPage.filters.endDate.placeholder",
				)}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
