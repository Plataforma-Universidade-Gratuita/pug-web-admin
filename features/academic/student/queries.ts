"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/academic/students";
import { studentQueryKeys } from "@/constants/query-keys";

export { studentQueryKeys };

export function useStudentsQuery() {
	return useQuery({
		queryKey: studentQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useStudentDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? studentQueryKeys.idleDetail() : studentQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
