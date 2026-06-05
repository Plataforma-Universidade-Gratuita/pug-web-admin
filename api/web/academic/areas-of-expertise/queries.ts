"use client";

import { useQuery } from "@tanstack/react-query";

import { areasOfExpertise } from "@/api/web";

const { areaOfExpertiseKeys: keys, get, list } = areasOfExpertise;

export function useAreasOfExpertiseQuery() {
	return useQuery({
		queryKey: keys.list(),
		queryFn: () => list(),
	});
}

export function useAreaOfExpertiseDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
