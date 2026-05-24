"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/academic/schools";

export const schoolQueryKeys = {
	all: ["academic", "school"] as const,
	list: () => [...schoolQueryKeys.all, "list"] as const,
	detail: (id: string) => [...schoolQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...schoolQueryKeys.all, "detail", "idle"] as const,
};

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
