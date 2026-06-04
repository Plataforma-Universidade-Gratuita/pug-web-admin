"use client";

import { useTranslation } from "react-i18next";

import { TextFieldFilter } from "@/features/shared/service-pages";
import { ServicePageFiltersDrawer } from "@/features/shared/service-pages";
import type { CitiesFiltersDrawerProps } from "@/types";

export function CitiesFiltersDrawer({
	nameFilter,
	hasActiveFilters,
	onApply,
	onClear,
	onNameFilterChange,
	onOpenChange,
	open,
}: CitiesFiltersDrawerProps) {
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
			clearConfirmDescription={t(
				"geo.cityPage.filters.backend.clearConfirm.description",
			)}
			clearLabel={t("geo.cityPage.filters.backend.clear")}
			applyLabel={t("common.filters.apply")}
			onClear={onClear}
			onApply={onApply}
		>
			<TextFieldFilter
				label={t("geo.cityPage.filters.backend.name.label")}
				value={nameFilter}
				onChange={onNameFilterChange}
				placeholder={t("geo.cityPage.filters.backend.name.placeholder")}
			/>
		</ServicePageFiltersDrawer>
	);
}
