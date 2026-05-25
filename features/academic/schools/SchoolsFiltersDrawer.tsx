"use client";

import { useTranslation } from "react-i18next";

import {
	AuditInfoFilterFields,
	ServicePageFiltersDrawer,
} from "@/features/shared/service-pages";
import type { SchoolAuditDateField, SchoolsFiltersDrawerProps } from "@/types";

export function SchoolsFiltersDrawer({
	dateField,
	endDate,
	hasActiveFilters,
	onApply,
	onClear,
	onDateFieldChange,
	onEndDateChange,
	onOpenChange,
	onStartDateChange,
	open,
	startDate,
}: SchoolsFiltersDrawerProps) {
	const { t } = useTranslation();

	return (
		<ServicePageFiltersDrawer
			open={open}
			onOpenChange={onOpenChange}
			hasActiveFilters={hasActiveFilters}
			label={t("academic.schoolPage.filters.drawer.label")}
			activeLabel={t("academic.schoolPage.filters.drawer.active")}
			triggerLabel={t("academic.schoolPage.filters.drawer.trigger")}
			overhead={t("academic.schoolPage.filters.drawer.overhead")}
			title={t("academic.schoolPage.filters.drawer.title")}
			clearConfirmTitle={t(
				"academic.schoolPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"academic.schoolPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("academic.schoolPage.filters.clear")}
			applyLabel={t("academic.schoolPage.filters.drawer.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<AuditInfoFilterFields
				dateFieldLabel={t("academic.schoolPage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"academic.schoolPage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as SchoolAuditDateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t("academic.schoolPage.filters.dateField.options.createdAt"),
					},
					{
						value: "updatedAt",
						label: t("academic.schoolPage.filters.dateField.options.updatedAt"),
					},
				]}
				startDateLabel={t("academic.schoolPage.filters.startDate.label")}
				startDatePlaceholder={t(
					"academic.schoolPage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("academic.schoolPage.filters.endDate.label")}
				endDatePlaceholder={t(
					"academic.schoolPage.filters.endDate.placeholder",
				)}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
