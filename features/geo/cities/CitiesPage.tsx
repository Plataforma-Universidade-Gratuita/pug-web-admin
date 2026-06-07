"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import * as web from "@/api/web";
import {
	ServicePageHeader,
	ServicePagePagination,
	ServicePageShell,
	ServicePageTableSection,
} from "@/components/composite";
import { NoContentState, SomeErrorState } from "@/components/primitives";
import { DEFAULT_SERVICE_PAGE_SIZE } from "@/constants";
import {
	useDraftFilters,
	useQueryErrorToasts,
	useServicePagePagination,
} from "@/hooks";
import type { CityResponse } from "@/types/api";

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
	const {
		currentPage,
		isAll,
		pageSize,
		resetPage,
		setCurrentPage,
		setPageSize,
		backendPage,
		backendSize,
	} = citiesPagination;
	const citiesQuery = useCitiesQuery(citiesPagination.isAll);
	const citiesSearchQuery = useCitiesSearchQuery(
		backendPage ?? 0,
		backendSize ?? DEFAULT_SERVICE_PAGE_SIZE,
		appliedFilters.name,
		!isAll,
	);
	const activeQuery = isAll ? citiesQuery : citiesSearchQuery;

	const allCities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data]);
	const backendFilteredCities = useMemo(
		() => filterCitiesByName(allCities, appliedFilters.name),
		[allCities, appliedFilters.name],
	);
	const tableSourceCities = useMemo(
		() =>
			isAll ? backendFilteredCities : (citiesSearchQuery.data?.content ?? []),
		[backendFilteredCities, isAll, citiesSearchQuery.data],
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

	const totalElements = isAll
		? backendFilteredCities.length
		: (citiesSearchQuery.data?.totalElements ?? 0);
	const totalPages = isAll
		? 1
		: Math.max(citiesSearchQuery.data?.totalPages ?? 1, 1);

	useEffect(() => {
		if (isAll || !citiesSearchQuery.data || currentPage <= totalPages) {
			return;
		}

		setCurrentPage(totalPages);
	}, [currentPage, isAll, setCurrentPage, citiesSearchQuery.data, totalPages]);

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
						resetPage();
						applyDraftFilters();
						setBackendFiltersOpen(false);
					}}
					onBackendFiltersOpenChange={setBackendFiltersOpen}
					onBackendNameFilterChange={value => {
						setDraftFilter("name", value);
					}}
					onClearBackendFilters={() => {
						clearFilters();
						resetPage();
						setBackendFiltersOpen(false);
					}}
					onFrontendSearchChange={setFrontendSearch}
					frontendSearch={frontendSearch}
				/>
			</ServicePageHeader>

			<ServicePageTableSection<CityResponse>
				footer={
					<ServicePagePagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalElements={totalElements}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						onPageSizeChange={setPageSize}
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
