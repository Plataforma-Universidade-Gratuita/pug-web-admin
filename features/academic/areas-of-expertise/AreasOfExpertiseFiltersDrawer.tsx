"use client";

import { useTranslation } from "react-i18next";

import { DatePicker, Label } from "@/components";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { AreasOfExpertiseFiltersDrawerProps } from "@/types";

export function AreasOfExpertiseFiltersDrawer({
	endDate,
	hasActiveFilters,
	onApply,
	onClear,
	onEndDateChange,
	onOpenChange,
	onStartDateChange,
	open,
	startDate,
}: AreasOfExpertiseFiltersDrawerProps) {
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
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label>{t("academic.schoolPage.filters.startDate.label")}</Label>
					<DatePicker
						value={startDate}
						onValueChange={onStartDateChange}
						placeholder={t("academic.schoolPage.filters.startDate.placeholder")}
						panelSide="left"
						panelAlign="start"
						panelAvoidCollisions
						panelCollisionPadding={16}
					/>
				</div>
				<div className="grid gap-2">
					<Label>{t("academic.schoolPage.filters.endDate.label")}</Label>
					<DatePicker
						value={endDate}
						onValueChange={onEndDateChange}
						placeholder={t("academic.schoolPage.filters.endDate.placeholder")}
						panelSide="left"
						panelAlign="start"
						panelAvoidCollisions
						panelCollisionPadding={16}
					/>
				</div>
			</div>
		</ServicePageFiltersDrawer>
	);
}
