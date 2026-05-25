"use client";

import { useQuery } from "@tanstack/react-query";

import { get as getCity, list as listCities } from "@/api/web/geo/cities";
import { cityQueryKeys } from "@/constants/query-keys";

export { cityQueryKeys };

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
