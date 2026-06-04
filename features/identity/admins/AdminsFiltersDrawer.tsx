"use client";

import { useTranslation } from "react-i18next";

import { Checkbox, DateRangeFilterFields } from "@/components";
import {
	NumberFieldFilter,
	ServicePageFiltersDrawer,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { AdminsFiltersDrawerProps } from "@/types";

export function AdminsFiltersDrawer({
	filters,
	hasActiveFilters,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
	open,
}: AdminsFiltersDrawerProps) {
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
				"identity.adminPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"identity.adminPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("common.filters.clear")}
			applyLabel={t("common.filters.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<TextFieldFilter
				label={t("identity.accountPage.filters.name.label")}
				value={filters.name}
				onChange={value => onFilterChange("name", value)}
				placeholder={t("identity.accountPage.filters.name.placeholder")}
			/>

			<NumberFieldFilter
				label={t("identity.accountPage.filters.cpf.label")}
				value={filters.cpf}
				onChange={value => onFilterChange("cpf", value)}
				placeholder={t("identity.accountPage.filters.cpf.placeholder")}
			/>

			<TextFieldFilter
				label={t("identity.accountPage.filters.email.label")}
				value={filters.email}
				onChange={value => onFilterChange("email", value)}
				placeholder={t("identity.accountPage.filters.email.placeholder")}
			/>

			<DateRangeFilterFields
				startLabel={t("common.filters.startDate.label")}
				startValue={filters.dateFrom}
				onStartValueChange={value => onFilterChange("dateFrom", value)}
				startPlaceholder={t("common.filters.startDate.placeholder")}
				endLabel={t("common.filters.endDate.label")}
				endValue={filters.dateTo}
				onEndValueChange={value => onFilterChange("dateTo", value)}
				endPlaceholder={t("common.filters.endDate.placeholder")}
			/>

			<Checkbox
				checked={filters.activeOnly}
				onCheckedChange={checked =>
					onFilterChange("activeOnly", checked === true)
				}
				label={t("identity.accountPage.filters.activeOnly.label")}
				description={t("identity.accountPage.filters.activeOnly.description")}
			/>
		</ServicePageFiltersDrawer>
	);
}
