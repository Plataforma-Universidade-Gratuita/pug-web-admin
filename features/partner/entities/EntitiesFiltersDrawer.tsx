"use client";

import { useTranslation } from "react-i18next";

import { Combobox, DatePicker, Label, SomeErrorState } from "@/components";
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
			{citiesError ? (
				<SomeErrorState
					title={t("partner.entityPage.filters.city.error.title")}
					description={t("partner.entityPage.filters.city.error.description")}
					onRefresh={onRefreshCities}
				/>
			) : (
				<div className="grid gap-2">
					<Label>{t("partner.entityPage.filters.city.label")}</Label>
					<Combobox
						multiple
						options={cityOptions}
						values={cityIdsFilter}
						onValuesChange={onCityIdsChange}
						placeholder={t("partner.entityPage.filters.city.placeholder")}
						searchPlaceholder={t(
							"partner.entityPage.filters.city.searchPlaceholder",
						)}
						emptyMessage={t("partner.entityPage.filters.city.emptyMessage")}
						disabled={isCitiesLoading}
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
