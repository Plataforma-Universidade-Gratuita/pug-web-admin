"use client";

import { useTranslation } from "react-i18next";

import { TextFieldFilter } from "@/features/shared/service-pages";
import type { CitiesFiltersProps } from "@/types";

import { CitiesFiltersDrawer } from "./CitiesFiltersDrawer";

export function CitiesFilters({
	backendNameFilter,
	backendFiltersOpen,
	hasBackendFilters,
	onApplyBackendFilters,
	onBackendFiltersOpenChange,
	onBackendNameFilterChange,
	onClearBackendFilters,
	onFrontendSearchChange,
	frontendSearch,
}: CitiesFiltersProps) {
	const { t } = useTranslation();

	return (
		<div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
			<TextFieldFilter
				value={frontendSearch}
				onChange={onFrontendSearchChange}
				placeholder={t("geo.cityPage.filters.frontend.searchPlaceholder")}
			/>
			<CitiesFiltersDrawer
				nameFilter={backendNameFilter}
				hasActiveFilters={hasBackendFilters}
				onApply={onApplyBackendFilters}
				onClear={onClearBackendFilters}
				onNameFilterChange={onBackendNameFilterChange}
				onOpenChange={onBackendFiltersOpenChange}
				open={backendFiltersOpen}
			/>
		</div>
	);
}
