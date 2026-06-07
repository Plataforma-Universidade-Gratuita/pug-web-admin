"use client";

import { useTranslation } from "react-i18next";

import { DateRangeFilterFields } from "@/components/composite";
import {
	NumberFieldFilter,
	ServicePageFiltersDrawer,
	TextFieldFilter,
} from "@/components/composite";
import type { UsersFiltersDrawerProps } from "@/types/client";

export function UsersFiltersDrawer({
	filters,
	hasActiveFilters,
	onApply,
	onClear,
	onFilterChange,
	onOpenChange,
	open,
}: UsersFiltersDrawerProps) {
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
				"identity.userPage.filters.backend.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"identity.userPage.filters.backend.clearConfirm.description",
			)}
			clearLabel={t("identity.userPage.filters.backend.clear")}
			applyLabel={t("common.filters.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<div className="grid gap-3">
				<TextFieldFilter
					label={t("common.filters.name.label")}
					value={filters.name}
					onChange={value => onFilterChange("name", value)}
					placeholder={t("common.filters.name.placeholder")}
				/>
			</div>

			<div className="grid gap-3">
				<NumberFieldFilter
					label={t("common.filters.cpf.label")}
					value={filters.cpf}
					onChange={value => onFilterChange("cpf", value)}
					placeholder={t("common.filters.cpf.placeholder")}
				/>
			</div>

			<div className="grid gap-3">
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
			</div>
		</ServicePageFiltersDrawer>
	);
}
