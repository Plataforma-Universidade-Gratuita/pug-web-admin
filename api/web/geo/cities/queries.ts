"use client";

import { useQuery } from "@tanstack/react-query";

import { cities } from "@/api/web";

const { get, list, search, cityKeys: keys } = cities;

export function useCitiesQuery(enabled = true) {
	return useQuery({
		queryKey: keys.list(),
		queryFn: () => list(),
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
		queryKey: keys.search(page, size, normalizedName),
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

export function useCityDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
