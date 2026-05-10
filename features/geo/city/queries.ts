"use client";

import { useQuery } from "@tanstack/react-query";

import { get as getCity, list as listCities } from "@/api/web/geo/cities";

export const cityQueryKeys = {
	all: ["geo", "cities"] as const,
	list: () => [...cityQueryKeys.all, "list"] as const,
	detail: (id: string) => [...cityQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...cityQueryKeys.all, "detail", "idle"] as const,
};

export function useCitiesQuery() {
	return useQuery({
		queryKey: cityQueryKeys.list(),
		queryFn: () => listCities(),
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
