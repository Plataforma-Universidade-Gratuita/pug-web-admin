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
			label={t("identity.userPage.filters.backend.label")}
			activeLabel={t("identity.userPage.filters.backend.active")}
			triggerLabel={t("identity.userPage.filters.backend.trigger")}
			overhead={t("identity.userPage.filters.backend.overhead")}
			title={t("identity.userPage.filters.backend.title")}
			clearConfirmTitle={t(
				"identity.userPage.filters.backend.clearConfirm.title",
			)}
			clearConfirmDescription={t(
				"identity.userPage.filters.backend.clearConfirm.description",
			)}
			clearLabel={t("identity.userPage.filters.backend.clear")}
			applyLabel={t("identity.userPage.filters.backend.apply")}
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
					<Label>{t("identity.userPage.filters.backend.dateFrom.label")}</Label>
					<DatePicker
						value={filters.dateFrom}
						onValueChange={value => onFilterChange("dateFrom", value)}
						placeholder={t(
							"identity.userPage.filters.backend.dateFrom.placeholder",
						)}
					/>
				</div>
			</div>

			<div className="grid gap-3">
				<div className="grid min-w-0 gap-2">
					<Label>{t("identity.userPage.filters.backend.dateTo.label")}</Label>
					<DatePicker
						value={filters.dateTo}
						onValueChange={value => onFilterChange("dateTo", value)}
						placeholder={t(
							"identity.userPage.filters.backend.dateTo.placeholder",
						)}
					/>
				</div>
			</div>
		</ServicePageFiltersDrawer>
	);
}
