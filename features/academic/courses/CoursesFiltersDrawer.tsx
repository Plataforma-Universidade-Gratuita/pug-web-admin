"use client";

import { useTranslation } from "react-i18next";

import { Combobox, Label, SomeErrorState } from "@/components";
import { DatePicker } from "@/components";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { CoursesFiltersDrawerProps } from "@/types";

export function CoursesFiltersDrawer({
	areaOfExpertiseIds,
	areaOfExpertiseOptions,
	areasOfExpertiseError,
	endDate,
	hasActiveFilters,
	isAreasOfExpertiseLoading,
	onApply,
	onAreaOfExpertiseIdsChange,
	onClear,
	onEndDateChange,
	onOpenChange,
	onRefreshAreasOfExpertise,
	onStartDateChange,
	open,
	startDate,
}: CoursesFiltersDrawerProps) {
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
			{areasOfExpertiseError ? (
				<SomeErrorState
					title={t("academic.coursePage.filters.school.error.title")}
					description={t(
						"academic.coursePage.filters.school.error.description",
					)}
					onRefresh={onRefreshAreasOfExpertise}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("academic.coursePage.filters.school.label")}</Label>
					<Combobox
						multiple
						options={areaOfExpertiseOptions}
						values={areaOfExpertiseIds}
						onValuesChange={onAreaOfExpertiseIdsChange}
						placeholder={t("academic.coursePage.filters.school.placeholder")}
						searchPlaceholder={t(
							"academic.coursePage.filters.school.searchPlaceholder",
						)}
						emptyMessage={t("academic.coursePage.filters.school.emptyMessage")}
						disabled={isAreasOfExpertiseLoading}
					/>
				</div>
			)}

			<div className="grid min-w-0 gap-2">
				<Label>{t("academic.coursePage.filters.startDate.label")}</Label>
				<DatePicker
					value={startDate}
					onValueChange={onStartDateChange}
					placeholder={t("academic.coursePage.filters.startDate.placeholder")}
				/>
			</div>

			<div className="grid min-w-0 gap-2">
				<Label>{t("academic.coursePage.filters.endDate.label")}</Label>
				<DatePicker
					value={endDate}
					onValueChange={onEndDateChange}
					placeholder={t("academic.coursePage.filters.endDate.placeholder")}
				/>
			</div>
		</ServicePageFiltersDrawer>
	);
}
