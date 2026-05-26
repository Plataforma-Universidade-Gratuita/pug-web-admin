"use client";

import { useQuery } from "@tanstack/react-query";

import {
	get as getCity,
	list as listCities,
	search as searchCities,
} from "@/api/web/geo/cities";
import { cityQueryKeys } from "@/constants";

export { cityQueryKeys };

export function useCitiesQuery(enabled = true) {
	return useQuery({
		queryKey: cityQueryKeys.list(),
		queryFn: () => listCities(),
		enabled,
	});
}

export function useCitiesSearchQuery(
	page: number,
	size: number,
	name: string,
	enabled = true,
) {
	const normalizedName = name.trim();
	const complexSearchRequest = {
		name: normalizedName || undefined,
	};

	return useQuery({
		queryKey: cityQueryKeys.search(page, size, normalizedName),
		queryFn: () =>
			searchCities(
				{
					page,
					size,
				},
				complexSearchRequest,
			),
		enabled,
	});
}

export function useCityDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? cityQueryKeys.idleDetail() : cityQueryKeys.detail(id),
		queryFn: () => getCity(id!),
		enabled: id !== null,
	});
}
