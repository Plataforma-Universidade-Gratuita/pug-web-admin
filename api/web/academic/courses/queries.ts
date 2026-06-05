"use client";

import { useQuery } from "@tanstack/react-query";

import { courseQueryKeys } from "@/constants";

import { get, list } from "./endpoints";

export { courseQueryKeys };

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
