"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { web } from "@/api";
import { NoContentState, SomeErrorState } from "@/components";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import {
	ServicePageHeader,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/features/shared/service-pages";
import {
	useDraftFilters,
	useQueryErrorToasts,
	useServicePagePagination,
} from "@/hooks";
import type { CityResponse } from "@/types";

import { CitiesFilters } from "./CitiesFilters";
import { CitiesRowActions } from "./CitiesRowActions";
import {
	createCityColumns,
	filterCitiesByName,
	filterCities,
	getCitiesEmptyStateCopy,
	getCitiesListErrorToastContent,
} from "./utils";

const { cities: citiesApi } = web.geo;
const { useCitiesQuery, useCitiesSearchQuery } = citiesApi;

export function CitiesPage() {
	const { t } = useTranslation();
	const [frontendSearch, setFrontendSearch] = useState("");
	const deferredFrontendSearch = useDeferredValue(frontendSearch.trim());
	const [backendFiltersOpen, setBackendFiltersOpen] = useState(false);
	const {
		appliedFilters,
		draftFilters,
		hasAppliedFilters,
		applyDraftFilters,
		clearFilters,
		setDraftFilter,
	} = useDraftFilters({
		initialFilters: {
			name: "",
		},
	});
	const citiesPagination = useServicePagePagination({
		key: "geo.cities",
	});
	const citiesQuery = useCitiesQuery(citiesPagination.isAll);
	const citiesSearchQuery = useCitiesSearchQuery(
		citiesPagination.backendPage ?? 0,
		citiesPagination.backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters.name,
		!citiesPagination.isAll,
	);
	const activeQuery = citiesPagination.isAll ? citiesQuery : citiesSearchQuery;

	const allCities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data]);
	const backendFilteredCities = useMemo(
		() => filterCitiesByName(allCities, appliedFilters.name),
		[allCities, appliedFilters.name],
	);
	const tableSourceCities = useMemo(
		() =>
			citiesPagination.isAll
				? backendFilteredCities
				: (citiesSearchQuery.data?.content ?? []),
		[backendFilteredCities, citiesPagination.isAll, citiesSearchQuery.data],
	);
	const filteredCities = useMemo(
		() => filterCities(tableSourceCities, deferredFrontendSearch),
		[deferredFrontendSearch, tableSourceCities],
	);
	const columns = useMemo(() => createCityColumns(t), [t]);
	const emptyStateCopy = useMemo(
		() =>
			getCitiesEmptyStateCopy(t, deferredFrontendSearch, appliedFilters.name),
		[t, deferredFrontendSearch, appliedFilters.name],
	);
	const tableEmptyState = useMemo(() => {
		if (activeQuery.isError) {
			return (
				<SomeErrorState
					title={t("geo.cityPage.table.error.title")}
					description={t("geo.cityPage.table.error.description")}
					onRefresh={() => {
						void activeQuery.refetch();
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
	}, [activeQuery, emptyStateCopy, t]);

	const totalElements = citiesPagination.isAll
		? backendFilteredCities.length
		: (citiesSearchQuery.data?.totalElements ?? 0);
	const totalPages = citiesPagination.isAll
		? 1
		: Math.max(citiesSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (
			citiesPagination.isAll ||
			!citiesSearchQuery.data ||
			citiesPagination.currentPage <= totalPages
		) {
			return;
		}

		citiesPagination.setCurrentPage(totalPages);
	}, [
		citiesPagination.currentPage,
		citiesPagination.isAll,
		citiesPagination.setCurrentPage,
		citiesSearchQuery.data,
		totalPages,
	]);

	useQueryErrorToasts([
		{
			key: "cities-table",
			error: activeQuery.error,
			errorUpdatedAt: activeQuery.errorUpdatedAt,
			getContent: error => getCitiesListErrorToastContent(t, error),
			isError: activeQuery.isError,
		},
	]);

	return (
		<ServicePageShell>
			<ServicePageHeader
				title={t("geo.cityPage.title")}
				description={t("geo.cityPage.description")}
				metadata={{
					triggerLabel: t("common.metadata.trigger"),
					emptyTitle: t("common.metadata.empty.title"),
					emptyDescription: t("common.metadata.empty.description"),
				}}
				filtersClassName="grid gap-2"
			>
				<CitiesFilters
					backendNameFilter={draftFilters.name}
					backendFiltersOpen={backendFiltersOpen}
					hasBackendFilters={hasAppliedFilters}
					onApplyBackendFilters={() => {
						citiesPagination.resetPage();
						applyDraftFilters();
						setBackendFiltersOpen(false);
					}}
					onBackendFiltersOpenChange={setBackendFiltersOpen}
					onBackendNameFilterChange={value => {
						setDraftFilter("name", value);
					}}
					onClearBackendFilters={() => {
						clearFilters();
						citiesPagination.resetPage();
						setBackendFiltersOpen(false);
					}}
					onFrontendSearchChange={setFrontendSearch}
					frontendSearch={frontendSearch}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<CityResponse>
				footer={
					<ServicePagePagination
						currentPage={citiesPagination.currentPage}
						pageSize={citiesPagination.pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={citiesPagination.setCurrentPage}
						onPageSizeChange={citiesPagination.setPageSize}
						disabled={activeQuery.isLoading}
					/>
				}
				tableProps={{
					className: "h-full",
					columns,
					data: filteredCities,
					emptyState: tableEmptyState,
					getRowActions: row => (
						<CitiesRowActions href={`/geo/cities/${row.id}`} />
					),
					isLoading: activeQuery.isLoading,
					loadingLabel: t("geo.cityPage.loading.list"),
				}}
			/>
		</ServicePageShell>
	);
}
