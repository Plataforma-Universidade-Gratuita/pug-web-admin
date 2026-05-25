"use client";

import { useTranslation } from "react-i18next";

import { Combobox, Label, SomeErrorState } from "@/components";
import {
	AuditInfoFilterFields,
	ServicePageFiltersDrawer,
} from "@/features/shared/service-pages";
import type { CourseAuditDateField, CourseFiltersDrawerProps } from "@/types";

export function CourseFiltersDrawer({
	dateField,
	endDate,
	hasActiveFilters,
	isSchoolsLoading,
	onApply,
	onClear,
	onDateFieldChange,
	onEndDateChange,
	onOpenChange,
	onRefreshSchools,
	onSchoolIdChange,
	onStartDateChange,
	open,
	schoolIdFilter,
	schoolOptions,
	schoolsError,
	startDate,
}: CourseFiltersDrawerProps) {
	const { t } = useTranslation();

	return (
		<ServicePageFiltersDrawer
			open={open}
			onOpenChange={onOpenChange}
			hasActiveFilters={hasActiveFilters}
			label={t("academic.coursePage.filters.drawer.label")}
			activeLabel={t("academic.coursePage.filters.drawer.active")}
			triggerLabel={t("academic.coursePage.filters.drawer.trigger")}
			overhead={t("academic.coursePage.filters.drawer.overhead")}
			title={t("academic.coursePage.filters.drawer.title")}
			clearConfirmTitle={t(
				"academic.coursePage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"academic.coursePage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("academic.coursePage.filters.clear")}
			applyLabel={t("academic.coursePage.filters.drawer.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			{schoolsError ? (
				<SomeErrorState
					title={t("academic.coursePage.filters.school.error.title")}
					description={t(
						"academic.coursePage.filters.school.error.description",
					)}
					onRefresh={onRefreshSchools}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("academic.coursePage.filters.school.label")}</Label>
					<Combobox
						options={schoolOptions}
						value={schoolIdFilter}
						onValueChange={onSchoolIdChange}
						placeholder={t("academic.coursePage.filters.school.placeholder")}
						searchPlaceholder={t(
							"academic.coursePage.filters.school.searchPlaceholder",
						)}
						emptyMessage={t("academic.coursePage.filters.school.emptyMessage")}
						disabled={isSchoolsLoading}
					/>
				</div>
			)}

			<AuditInfoFilterFields
				dateFieldLabel={t("academic.coursePage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"academic.coursePage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as CourseAuditDateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t("academic.coursePage.filters.dateField.options.createdAt"),
					},
					{
						value: "updatedAt",
						label: t("academic.coursePage.filters.dateField.options.updatedAt"),
					},
				]}
				startDateLabel={t("academic.coursePage.filters.startDate.label")}
				startDatePlaceholder={t(
					"academic.coursePage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("academic.coursePage.filters.endDate.label")}
				endDatePlaceholder={t(
					"academic.coursePage.filters.endDate.placeholder",
				)}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
