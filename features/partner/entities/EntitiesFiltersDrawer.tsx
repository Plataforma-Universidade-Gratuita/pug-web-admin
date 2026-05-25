"use client";

import { useTranslation } from "react-i18next";

import { Combobox, Label, SomeErrorState } from "@/components";
import {
	AuditInfoFilterFields,
	ServicePageFiltersDrawer,
} from "@/features/shared/service-pages";
import type { EntitiesFiltersDrawerProps, EntityAuditDateField } from "@/types";

export function EntitiesFiltersDrawer({
	citiesError,
	cityIdFilter,
	cityOptions,
	dateField,
	endDate,
	hasActiveFilters,
	isCitiesLoading,
	onApply,
	onCityIdChange,
	onClear,
	onDateFieldChange,
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
			label={t("partner.entityPage.filters.drawer.label")}
			activeLabel={t("partner.entityPage.filters.drawer.active")}
			triggerLabel={t("partner.entityPage.filters.drawer.trigger")}
			overhead={t("partner.entityPage.filters.drawer.overhead")}
			title={t("partner.entityPage.filters.drawer.title")}
			clearConfirmTitle={t(
				"partner.entityPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"partner.entityPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("partner.entityPage.filters.clear")}
			applyLabel={t("partner.entityPage.filters.drawer.apply")}
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
						options={cityOptions}
						value={cityIdFilter}
						onValueChange={onCityIdChange}
						placeholder={t("partner.entityPage.filters.city.placeholder")}
						searchPlaceholder={t(
							"partner.entityPage.filters.city.searchPlaceholder",
						)}
						emptyMessage={t("partner.entityPage.filters.city.emptyMessage")}
						disabled={isCitiesLoading}
					/>
				</div>
			)}

			<AuditInfoFilterFields
				dateFieldLabel={t("partner.entityPage.filters.dateField.label")}
				dateFieldPlaceholder={t(
					"partner.entityPage.filters.dateField.placeholder",
				)}
				dateField={dateField}
				onDateFieldChange={value =>
					onDateFieldChange(value as EntityAuditDateField)
				}
				dateFieldOptions={[
					{
						value: "createdAt",
						label: t("partner.entityPage.filters.dateField.options.createdAt"),
					},
					{
						value: "updatedAt",
						label: t("partner.entityPage.filters.dateField.options.updatedAt"),
					},
				]}
				startDateLabel={t("partner.entityPage.filters.startDate.label")}
				startDatePlaceholder={t(
					"partner.entityPage.filters.startDate.placeholder",
				)}
				startDate={startDate}
				onStartDateChange={onStartDateChange}
				endDateLabel={t("partner.entityPage.filters.endDate.label")}
				endDatePlaceholder={t("partner.entityPage.filters.endDate.placeholder")}
				endDate={endDate}
				onEndDateChange={onEndDateChange}
			/>
		</ServicePageFiltersDrawer>
	);
}
