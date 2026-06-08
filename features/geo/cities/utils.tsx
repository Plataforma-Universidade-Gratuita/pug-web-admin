import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { createTableTextColumn } from "@/components/composite";
import type { CityResponse } from "@/types/api";
import { getApiErrorToastContent } from "@/utils";
import { normalizeTextForSearch } from "@/utils";

export function createCityColumns(t: TFunction): ColumnDef<CityResponse>[] {
	return [
		createTableTextColumn<CityResponse>({
			id: "id",
			accessorKey: "id",
			header: t("table.columns.id"),
			text: row => row.id,
		}),
		{
			accessorKey: "name",
			header: t("table.columns.city"),
			cell: ({ row }) => row.original.name,
		},
		{
			accessorKey: "ibgeCode",
			header: t("geo.cityPage.table.columns.ibgeCode"),
			cell: ({ row }) => row.original.ibgeCode,
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

export function filterCitiesByName(cities: CityResponse[], name: string) {
	if (!name) {
		return cities;
	}

	const normalizedName = normalizeTextForSearch(name.trim());

	return cities.filter(city =>
		normalizeTextForSearch(city.name).includes(normalizedName),
	);
}

export function getCitiesEmptyStateCopy(
	t: TFunction,
	frontendQuery: string,
	backendNameFilter: string,
) {
	const activeFilterValue = frontendQuery || backendNameFilter;

	return {
		title: t("common.empty.title"),
		description: activeFilterValue
			? t("common.empty.filteredDescription", {
					value: activeFilterValue,
				})
			: t("common.empty.defaultDescription"),
	};
}

export function getCitiesListErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.errors.listLoad.title"),
		fallbackDescription: t("common.errors.listLoad.description"),
	});
}

export function getCityDetailErrorToastContent(t: TFunction, error: unknown) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t("common.errors.detailLoad.title"),
		fallbackDescription: t("common.errors.detailLoad.description"),
	});
}
