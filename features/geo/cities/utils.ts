import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import type { CityResponse } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { normalizeTextForSearch } from "@/utils";

export function createCityColumns(t: TFunction): ColumnDef<CityResponse>[] {
	return [
		{
			accessorKey: "id",
			header: t("geo.cityPage.dialog.fields.id"),
		},
		{
			accessorKey: "name",
			header: t("geo.cityPage.table.columns.name"),
		},
		{
			accessorKey: "ibgeCode",
			header: t("geo.cityPage.table.columns.ibgeCode"),
		},
	];
}

export function filterCities(cities: CityResponse[], query: string) {
	if (!query) {
		return cities;
	}

	const normalizedQuery = normalizeTextForSearch(query.trim());

	return cities.filter(city => {
		const normalizedId = normalizeTextForSearch(city.id);
		const normalizedName = normalizeTextForSearch(city.name);
		return (
			normalizedId.includes(normalizedQuery) ||
			normalizedName.includes(normalizedQuery) ||
			normalizeTextForSearch(city.ibgeCode).includes(normalizedQuery)
		);
	});
}

export function getCitiesEmptyStateCopy(t: TFunction, query: string) {
	return {
		title: t("geo.cityPage.empty.title"),
		description: query
			? t("geo.cityPage.empty.filteredDescription", { value: query })
			: t("geo.cityPage.empty.defaultDescription"),
	};
}

export function getCitiesListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("geo.cityPage.feedback.listError.title"),
		fallbackDescription: t("geo.cityPage.feedback.listError.description"),
	});
}

export function getCityDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("geo.cityPage.feedback.detailError.title"),
		fallbackDescription: t("geo.cityPage.feedback.detailError.description"),
	});
}
