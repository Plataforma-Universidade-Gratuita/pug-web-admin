"use client";

import { useQuery } from "@tanstack/react-query";

import { courses } from "@/api/web";

const { courseKeys: keys, get, list } = courses;

export function useCoursesQuery() {
	return useQuery({
		queryKey: keys.list(),
		queryFn: () => list(),
	});
}

export function useCourseDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
