"use client";

import { useTranslation } from "react-i18next";

import { TextFieldFilter } from "@/features/shared/service-pages";
import type { CityFiltersProps } from "@/types";

export function CityFilters({ onSearchChange, search }: CityFiltersProps) {
	const { t } = useTranslation();

	return (
		<TextFieldFilter
			value={search}
			onChange={onSearchChange}
			placeholder={t("geo.cityPage.filters.searchPlaceholder")}
		/>
	);
}
