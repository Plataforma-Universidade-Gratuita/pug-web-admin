"use client";

import { useQuery } from "@tanstack/react-query";

import { schoolQueryKeys } from "@/constants/query-keys";

import { get, list } from "@/api/web/academic/schools";

export { schoolQueryKeys };

export function useSchoolsQuery() {
	return useQuery({
		queryKey: schoolQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useSchoolDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? schoolQueryKeys.idleDetail() : schoolQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
