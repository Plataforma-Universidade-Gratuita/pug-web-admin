"use client";

import { useTranslation } from "react-i18next";

import { TextFieldFilter } from "@/features/shared/service-pages";
import type { CitiesFiltersProps } from "@/types";

export function CitiesFilters({ onSearchChange, search }: CitiesFiltersProps) {
	const { t } = useTranslation();

	return (
		<TextFieldFilter
			value={search}
			onChange={onSearchChange}
			placeholder={t("geo.cityPage.filters.searchPlaceholder")}
		/>
	);
}
