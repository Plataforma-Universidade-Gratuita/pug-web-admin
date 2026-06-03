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
	getStudentActiveOptionClassName,
	getFormerStudentCampusOptions,
} from "@/features/academic/former-students/utils";
import { AuditInfoFilterFields } from "@/features/shared/service-pages";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { FormerStudentsFiltersDrawerProps } from "@/types";

export function FormerStudentsFiltersDrawer({
	activeFilter,
	campusFilter,
	courseIdFilter,
	courseOptions,
	coursesError,
	dateField,
	endDate,
	hasActiveFilters,
	onActiveFilterChange,
	onApply,
	onCampusFilterChange,
	onClear,
	onCourseIdFilterChange,
	onDateFieldChange,
	onEndDateChange,
	onOpenChange,
	onRefreshCourses,
	onStartDateChange,
	open,
	startDate,
}: FormerStudentsFiltersDrawerProps) {
	const { t } = useTranslation();
	const campusOptions = useMemo(() => getFormerStudentCampusOptions(t), [t]);

	return (
		<ServicePageFiltersDrawer
			activeLabel={t("academic.studentPage.filters.drawer.active")}
			applyLabel={t("academic.studentPage.filters.drawer.apply")}
			clearConfirmDescription={t(
				"academic.studentPage.filters.drawer.clearConfirm.description",
			)}
			clearConfirmTitle={t(
				"academic.studentPage.filters.drawer.clearConfirm.title",
			)}
			clearLabel={t("academic.studentPage.filters.clear")}
			hasActiveFilters={hasActiveFilters}
			label={t("academic.studentPage.filters.drawer.label")}
			onApply={onApply}
			onClear={onClear}
			onOpenChange={onOpenChange}
			open={open}
			overhead={t("academic.studentPage.filters.drawer.overhead")}
			title={t("academic.studentPage.filters.drawer.title")}
			triggerLabel={t("academic.studentPage.filters.drawer.trigger")}
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<p className="field-label">
						{t("academic.studentPage.filters.active.label")}
					</p>
					<Select
						value={activeFilter}
						onValueChange={onActiveFilterChange}
					>
						<SelectTrigger
							className="w-full"
							placeholder={t("academic.studentPage.filters.active.placeholder")}
						/>
						<SelectContent>
							<SelectItem
								value="true"
								className={getStudentActiveOptionClassName("true")}
							>
								{t("academic.studentPage.filters.active.options.active")}
							</SelectItem>
							<SelectItem
								value="false"
								className={getStudentActiveOptionClassName("false")}
							>
								{t("academic.studentPage.filters.active.options.inactive")}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="grid gap-2">
					<p className="field-label">
						{t("academic.studentPage.filters.campus.label")}
					</p>
					<Select
						value={campusFilter}
						onValueChange={onCampusFilterChange}
					>
						<SelectTrigger
							className="w-full"
							placeholder={t("academic.studentPage.filters.campus.placeholder")}
						/>
						<SelectContent>
							{campusOptions.map(option => (
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
			</div>

			{coursesError ? (
				<SomeErrorState
					title={t("academic.studentPage.filters.course.error.title")}
					description={t(
						"academic.studentPage.filters.course.error.description",
					)}
					onRefresh={onRefreshCourses}
				/>
			) : (
				<div className="grid gap-2">
					<p className="field-label">
						{t("academic.studentPage.filters.course.label")}
					</p>
					<Combobox
						options={courseOptions}
						value={courseIdFilter}
						onValueChange={onCourseIdFilterChange}
						placeholder={t("academic.studentPage.filters.course.placeholder")}
						searchPlaceholder={t(
							"academic.studentPage.filters.course.searchPlaceholder",
						)}
						emptyMessage={t("academic.studentPage.filters.course.emptyMessage")}
					/>
				</div>
			)}

			<AuditInfoFilterFields
				dateFieldLabel={t("academic.studentPage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"academic.studentPage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as typeof dateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t(
							"academic.studentPage.filters.dateField.options.createdAt",
						),
					},
					{
						value: "updatedAt",
						label: t(
							"academic.studentPage.filters.dateField.options.updatedAt",
						),
					},
				]}
				startDateLabel={t("academic.studentPage.filters.startDate.label")}
				startDatePlaceholder={t(
					"academic.studentPage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("academic.studentPage.filters.endDate.label")}
				endDatePlaceholder={t(
					"academic.studentPage.filters.endDate.placeholder",
				)}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
