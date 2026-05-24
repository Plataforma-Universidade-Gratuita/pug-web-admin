"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { NoContentState, SomeErrorState } from "@/components";
import { CityDetailDialog } from "@/features/geo/city/CityDetailDialog";
import { CityFilters } from "@/features/geo/city/CityFilters";
import { CityRowActions } from "@/features/geo/city/CityRowActions";
import {
	useCitiesQuery,
	useCityDetailQuery,
} from "@/features/geo/city/queries";
import {
	createCityColumns,
	filterCities,
	getCitiesEmptyStateCopy,
	getCitiesListErrorToastContent,
	getCityDetailErrorToastContent,
} from "@/features/geo/city/utils";
import {
	ServicePageHeader,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import { useQueryErrorToast } from "@/hooks";
import type { CityResponse } from "@/types/api";

export function CityPage() {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");
	const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
	const deferredSearch = useDeferredValue(search.trim());
	const citiesQuery = useCitiesQuery();
	const cityDetailQuery = useCityDetailQuery(selectedCityId);

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

	useQueryErrorToast({
		error: citiesQuery.error,
		errorUpdatedAt: citiesQuery.errorUpdatedAt,
		getContent: error => getCitiesListErrorToastContent(t, error),
		isError: citiesQuery.isError,
	});
	useQueryErrorToast({
		error: cityDetailQuery.error,
		errorUpdatedAt: cityDetailQuery.errorUpdatedAt,
		getContent: error => getCityDetailErrorToastContent(t, error),
		isError: cityDetailQuery.isError,
	});

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
				<CityFilters
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
						<CityRowActions
							city={row}
							onView={setSelectedCityId}
						/>
					),
					isLoading: citiesQuery.isLoading,
					loadingLabel: t("geo.cityPage.loading.list"),
				}}
			/>

			<CityDetailDialog
				city={cityDetailQuery.data}
				error={cityDetailQuery.error}
				isError={cityDetailQuery.isError}
				isLoading={cityDetailQuery.isLoading}
				onOpenChange={open => {
					if (!open) {
						setSelectedCityId(null);
					}
				}}
				onRefresh={() => {
					void cityDetailQuery.refetch();
				}}
				open={selectedCityId !== null}
			/>
		</ServicePageShell>
	);
}
