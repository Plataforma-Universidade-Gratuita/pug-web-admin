"use client";

import { useQuery } from "@tanstack/react-query";

import { entityQueryKeys } from "@/constants/query-keys";

import { get, list, listCities } from "@/api/web/partner/entities";

export { entityQueryKeys };

export function useEntitiesQuery() {
	return useQuery({
		queryKey: entityQueryKeys.list(),
		queryFn: () => list(),
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
