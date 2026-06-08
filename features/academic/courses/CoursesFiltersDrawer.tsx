"use client";

import { useTranslation } from "react-i18next";

import { ServicePageFiltersDrawer } from "@/components/composite";
import { Combobox, Label, SomeErrorState } from "@/components/primitives";
import { DatePicker } from "@/components/primitives";
import type { CoursesFiltersDrawerProps } from "@/types/client";

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
			label={t("common.filters.label")}
			activeLabel={t("common.filters.active")}
			triggerLabel={t("common.filters.more")}
			overhead={t("common.filters.overhead")}
			title={t("common.filters.title")}
			clearConfirmTitle={t("common.filters.clearConfirm.title")}
			clearConfirmDescription={t("common.filters.clearConfirm.description")}
			clearLabel={t("common.filters.clear")}
			applyLabel={t("common.filters.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			{areasOfExpertiseError ? (
				<SomeErrorState
					title={t("common.loadErrors.areasOfExpertise.title")}
					description={t("common.loadErrors.areasOfExpertise.description")}
					onRefresh={onRefreshAreasOfExpertise}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("common.fields.areaOfExpertise")}</Label>
					<Combobox
						multiple
						options={areaOfExpertiseOptions}
						values={areaOfExpertiseIds}
						onValuesChange={onAreaOfExpertiseIdsChange}
						placeholder={t("common.placeholders.select")}
						searchPlaceholder={t("common.placeholders.search")}
						emptyMessage={t("common.placeholders.noResults")}
						disabled={isAreasOfExpertiseLoading}
					/>
				</div>
			)}

			<div className="grid min-w-0 gap-2">
				<Label>{t("common.filters.startDate.label")}</Label>
				<DatePicker
					value={startDate}
					onValueChange={onStartDateChange}
					placeholder={t("common.filters.startDate.placeholder")}
				/>
			</div>

			<div className="grid min-w-0 gap-2">
				<Label>{t("common.filters.endDate.label")}</Label>
				<DatePicker
					value={endDate}
					onValueChange={onEndDateChange}
					placeholder={t("common.filters.endDate.placeholder")}
				/>
			</div>
		</ServicePageFiltersDrawer>
	);
}
