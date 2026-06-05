"use client";

import { useQuery } from "@tanstack/react-query";

import { cityQueryKeys } from "@/constants";

import {
	get as getCity,
	list as listCities,
	search as searchCities,
} from "./endpoints";

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
		name: normalizedName,
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
