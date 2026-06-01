"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/academic/areas-of-expertise";
import { areaOfExpertiseQueryKeys } from "@/constants";

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
