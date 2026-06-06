"use client";

import { useTranslation } from "react-i18next";

import { DatePicker, Label } from "@/components";
import { ServicePageFiltersDrawer } from "@/components";
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
			label={t("common.filters.label")}
			activeLabel={t("common.filters.active")}
			triggerLabel={t("common.filters.more")}
			overhead={t("common.filters.overhead")}
			title={t("common.filters.title")}
			clearConfirmTitle={t(
				"academic.areaOfExpertisePage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"academic.areaOfExpertisePage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("common.filters.clear")}
			applyLabel={t("common.filters.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="grid gap-2">
					<Label>
						{t("academic.areaOfExpertisePage.filters.startDate.label")}
					</Label>
					<DatePicker
						value={startDate}
						onValueChange={onStartDateChange}
						placeholder={t(
							"academic.areaOfExpertisePage.filters.startDate.placeholder",
						)}
						panelSide="left"
						panelAlign="start"
						panelAvoidCollisions
						panelCollisionPadding={16}
					/>
				</div>
				<div className="grid gap-2">
					<Label>
						{t("academic.areaOfExpertisePage.filters.endDate.label")}
					</Label>
					<DatePicker
						value={endDate}
						onValueChange={onEndDateChange}
						placeholder={t(
							"academic.areaOfExpertisePage.filters.endDate.placeholder",
						)}
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
