"use client";

import { useTranslation } from "react-i18next";

import { AsyncComboboxFilterField, DateRangeFilterFields } from "@/components";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { EntitiesFiltersDrawerProps } from "@/types";

export function EntitiesFiltersDrawer({
	citiesError,
	cityIdsFilter,
	cityOptions,
	endDate,
	hasActiveFilters,
	isCitiesLoading,
	onApply,
	onCityIdsChange,
	onClear,
	onEndDateChange,
	onOpenChange,
	onRefreshCities,
	onStartDateChange,
	open,
	startDate,
}: EntitiesFiltersDrawerProps) {
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
				"partner.entityPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"partner.entityPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("common.filters.clear")}
			applyLabel={t("common.filters.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<AsyncComboboxFilterField
				multiple
				label={t("partner.entityPage.filters.city.label")}
				options={cityOptions}
				values={cityIdsFilter}
				onValuesChange={onCityIdsChange}
				placeholder={t("partner.entityPage.filters.city.placeholder")}
				searchPlaceholder={t(
					"partner.entityPage.filters.city.searchPlaceholder",
				)}
				emptyMessage={t("partner.entityPage.filters.city.emptyMessage")}
				disabled={isCitiesLoading}
				isError={Boolean(citiesError)}
				errorTitle={t("partner.entityPage.filters.city.error.title")}
				errorDescription={t(
					"partner.entityPage.filters.city.error.description",
				)}
				onRefreshError={onRefreshCities}
			/>

			<DateRangeFilterFields
				startLabel={t("common.filters.startDate.label")}
				startValue={startDate}
				onStartValueChange={onStartDateChange}
				startPlaceholder={t("common.filters.startDate.placeholder")}
				endLabel={t("common.filters.endDate.label")}
				endValue={endDate}
				onEndValueChange={onEndDateChange}
				endPlaceholder={t("common.filters.endDate.placeholder")}
			/>
		</ServicePageFiltersDrawer>
	);
}
