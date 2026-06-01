"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list, listCities, search } from "@/api/web/partner/entities";
import { entityQueryKeys } from "@/constants";
import type { UseEntitiesSearchQueryFilters } from "@/types";

import { buildEntityComplexSearchRequest } from "./utils";

export { entityQueryKeys };

export function useEntitiesQuery(enabled = true) {
	return useQuery({
		queryKey: entityQueryKeys.list(),
		queryFn: () => list(),
		enabled,
	});
}

export function useEntitiesSearchQuery(
	page: number,
	size: number,
	filters: UseEntitiesSearchQueryFilters,
	enabled = true,
) {
	const complexSearchRequest = buildEntityComplexSearchRequest(filters);
	const filtersKey = JSON.stringify(complexSearchRequest);

	return useQuery({
		queryKey: entityQueryKeys.search(page, size, filtersKey),
		queryFn: () =>
			search(
				{
					page,
					size,
				},
				complexSearchRequest,
			),
		enabled,
	});
}

export function useEntityCitiesQuery() {
	return useQuery({
		queryKey: entityQueryKeys.cities(),
		queryFn: listCities,
	});
}

export function useEntityDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? entityQueryKeys.idleDetail() : entityQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
