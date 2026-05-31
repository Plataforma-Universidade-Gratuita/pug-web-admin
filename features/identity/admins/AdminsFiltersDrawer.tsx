"use client";

import { useTranslation } from "react-i18next";

import { Checkbox, DatePicker, Label } from "@/components";
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
			label={t("identity.adminPage.filters.drawer.label")}
			activeLabel={t("identity.adminPage.filters.drawer.active")}
			triggerLabel={t("identity.adminPage.filters.drawer.trigger")}
			overhead={t("identity.adminPage.filters.drawer.overhead")}
			title={t("identity.adminPage.filters.drawer.title")}
			clearConfirmTitle={t(
				"identity.adminPage.filters.drawer.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"identity.adminPage.filters.drawer.clearConfirm.description",
			)}
			clearLabel={t("identity.adminPage.filters.clear")}
			applyLabel={t("identity.adminPage.filters.drawer.apply")}
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

			<div className="grid min-w-0 gap-2">
				<Label>{t("identity.accountPage.filters.startDate.label")}</Label>
				<DatePicker
					value={filters.dateFrom}
					onValueChange={value => onFilterChange("dateFrom", value)}
					placeholder={t("identity.accountPage.filters.startDate.placeholder")}
				/>
			</div>

			<div className="grid min-w-0 gap-2">
				<Label>{t("identity.accountPage.filters.endDate.label")}</Label>
				<DatePicker
					value={filters.dateTo}
					onValueChange={value => onFilterChange("dateTo", value)}
					placeholder={t("identity.accountPage.filters.endDate.placeholder")}
				/>
			</div>

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
