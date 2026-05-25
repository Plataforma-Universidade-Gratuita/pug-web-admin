"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState } from "@/components";
import { CitiesFilters } from "./CitiesFilters";
import { CitiesRowActions } from "./CitiesRowActions";
import { useCitiesQuery } from "./queries";
import {
	createCityColumns,
	filterCities,
	getCitiesEmptyStateCopy,
	getCitiesListErrorToastContent,
} from "./utils";
import {
	ServicePageHeader,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import { useQueryErrorToasts } from "@/hooks";
import type { CityResponse } from "@/types";

export function CitiesPage() {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");
	const deferredSearch = useDeferredValue(search.trim());
	const citiesQuery = useCitiesQuery();

	const allCities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data]);
	const filteredCities = useMemo(
		() => filterCities(allCities, deferredSearch),
		[allCities, deferredSearch],
	);
	const columns = useMemo(() => createCityColumns(t), [t]);
	const emptyStateCopy = useMemo(
		() => getCitiesEmptyStateCopy(t, deferredSearch),
		[t, deferredSearch],
	);
	const tableEmptyState = useMemo(() => {
		if (citiesQuery.isError) {
			return (
				<SomeErrorState
					title={t("geo.cityPage.table.error.title")}
					description={t("geo.cityPage.table.error.description")}
					onRefresh={() => {
						void citiesQuery.refetch();
					}}
				/>
			);
		}

		return (
			<NoContentState
				title={emptyStateCopy.title}
				description={emptyStateCopy.description}
			/>
		);
	}, [citiesQuery, emptyStateCopy, t]);

	useQueryErrorToasts([
		{
			key: "cities-list",
			error: citiesQuery.error,
			errorUpdatedAt: citiesQuery.errorUpdatedAt,
			getContent: error => getCitiesListErrorToastContent(t, error),
			isError: citiesQuery.isError,
		},
	]);

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("geo.cityPage.title")}
				description={t("geo.cityPage.description")}
				metadata={{
					triggerLabel: t("geo.cityPage.metadata.trigger"),
					emptyTitle: t("geo.cityPage.metadata.empty.title"),
					emptyDescription: t("geo.cityPage.metadata.empty.description"),
				}}
				filtersClassName="grid gap-2"
			>
				<CitiesFilters
					search={search}
					onSearchChange={setSearch}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<CityResponse>
				tableProps={{
					className: "h-full",
					columns,
					data: filteredCities,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<CitiesRowActions href={`/geo/cities/${row.id}`} />
					),
					isLoading: citiesQuery.isLoading,
					loadingLabel: t("geo.cityPage.loading.list"),
				}}
			/>
		</ServicePageShell>
	);
}
