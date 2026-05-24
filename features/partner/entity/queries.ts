"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list, listCities } from "@/api/web/partner/entities";

export const entityQueryKeys = {
	all: ["partner", "entity"] as const,
	list: () => [...entityQueryKeys.all, "list"] as const,
	cities: () => [...entityQueryKeys.all, "cities"] as const,
	detail: (id: string) => [...entityQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...entityQueryKeys.all, "detail", "idle"] as const,
};

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
