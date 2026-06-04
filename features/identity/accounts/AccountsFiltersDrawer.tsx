"use client";

import { useTranslation } from "react-i18next";

import {
	AsyncComboboxFilterField,
	Checkbox,
	DateRangeFilterFields,
} from "@/components";
import { ACCOUNT_TYPE_VALUES } from "@/constants";
import {
	NumberFieldFilter,
	ServicePageFiltersDrawer,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { AccountsFiltersDrawerProps } from "@/types";

export function AccountsFiltersDrawer({
	filters,
	hasActiveFilters,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
	open,
}: AccountsFiltersDrawerProps) {
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
				"identity.accountPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"identity.accountPage.filters.drawer.clearConfirm.description",
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

			<AsyncComboboxFilterField
				multiple
				label={t("identity.accountPage.filters.accountType.label")}
				values={filters.accountTypes}
				onValuesChange={value =>
					onFilterChange("accountTypes", value as typeof filters.accountTypes)
				}
				placeholder={t("common.placeholders.select")}
				searchPlaceholder={t("common.placeholders.select")}
				emptyMessage={t("identity.accountPage.filters.accountType.options.all")}
				options={ACCOUNT_TYPE_VALUES.map(accountType => ({
					value: accountType,
					label: t(
						`identity.accountPage.filters.accountType.options.${accountType}`,
					),
				}))}
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
