import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

import { TableText } from "@/components";
import { TABLE_TRUNCATED_COLUMN_WIDTH } from "@/constants";
import type { CityResponse } from "@/types";
import { getApiErrorToastContent } from "@/utils";
import { normalizeTextForSearch } from "@/utils";

export function createCityColumns(t: TFunction): ColumnDef<CityResponse>[] {
	return [
		{
			accessorKey: "id",
			header: t("common.fields.id"),
			cell: ({ row }) => (
				<TableText
					text={row.original.id}
					tooltiped
				/>
			),
		},
		{
			accessorKey: "name",
			header: t("geo.cityPage.table.columns.name"),
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
		title: t("geo.cityPage.empty.title"),
		description: activeFilterValue
			? t("geo.cityPage.empty.filteredDescription", {
					value: activeFilterValue,
				})
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
