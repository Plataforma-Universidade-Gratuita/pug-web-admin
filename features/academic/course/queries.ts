"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/academic/courses";

export const courseQueryKeys = {
	all: ["academic", "course"] as const,
	list: () => [...courseQueryKeys.all, "list"] as const,
	detail: (id: string) => [...courseQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...courseQueryKeys.all, "detail", "idle"] as const,
};

export function useCoursesQuery() {
	return useQuery({
		queryKey: courseQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useCourseDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? courseQueryKeys.idleDetail() : courseQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
