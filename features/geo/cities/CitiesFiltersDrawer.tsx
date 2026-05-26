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
			label={t("geo.cityPage.filters.backend.label")}
			activeLabel={t("geo.cityPage.filters.backend.active")}
			triggerLabel={t("geo.cityPage.filters.backend.trigger")}
			overhead={t("geo.cityPage.filters.backend.overhead")}
			title={t("geo.cityPage.filters.backend.title")}
			clearConfirmTitle={t("geo.cityPage.filters.backend.clearConfirm.title")}
			clearConfirmDescription={t(
				"geo.cityPage.filters.backend.clearConfirm.description",
			)}
			clearLabel={t("geo.cityPage.filters.backend.clear")}
			applyLabel={t("geo.cityPage.filters.backend.apply")}
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
