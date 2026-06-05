"use client";

import { useQuery } from "@tanstack/react-query";

import { areaOfExpertiseQueryKeys } from "@/constants";

import { get, list } from "./endpoints";

export { areaOfExpertiseQueryKeys };

export function useAreasOfExpertiseQuery() {
	return useQuery({
		queryKey: areaOfExpertiseQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useAreaOfExpertiseDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null
				? areaOfExpertiseQueryKeys.idleDetail()
				: areaOfExpertiseQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
