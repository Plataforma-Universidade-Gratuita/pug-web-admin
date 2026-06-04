"use client";

import { useTranslation } from "react-i18next";

import { DatePicker, Label } from "@/components";
import {
	NumberFieldFilter,
	ServicePageFiltersDrawer,
	TextFieldFilter,
} from "@/features/shared/service-pages";
import type { UsersFiltersDrawerProps } from "@/types";

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
					label={t("identity.userPage.filters.backend.name.label")}
					value={filters.name}
					onChange={value => onFilterChange("name", value)}
					placeholder={t("identity.userPage.filters.backend.name.placeholder")}
				/>
			</div>

			<div className="grid gap-3">
				<NumberFieldFilter
					label={t("identity.userPage.filters.backend.cpf.label")}
					value={filters.cpf}
					onChange={value => onFilterChange("cpf", value)}
					placeholder={t("identity.userPage.filters.backend.cpf.placeholder")}
				/>
			</div>

			<div className="grid gap-3">
				<div className="grid min-w-0 gap-2">
					<Label>{t("common.filters.startDate.label")}</Label>
					<DatePicker
						value={filters.dateFrom}
						onValueChange={value => onFilterChange("dateFrom", value)}
						placeholder={t("common.filters.startDate.placeholder")}
					/>
				</div>
			</div>

			<div className="grid gap-3">
				<div className="grid min-w-0 gap-2">
					<Label>{t("common.filters.endDate.label")}</Label>
					<DatePicker
						value={filters.dateTo}
						onValueChange={value => onFilterChange("dateTo", value)}
						placeholder={t("common.filters.endDate.placeholder")}
					/>
				</div>
			</div>
		</ServicePageFiltersDrawer>
	);
}
