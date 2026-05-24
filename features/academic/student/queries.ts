"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/academic/students";

export const studentQueryKeys = {
	all: ["academic", "student"] as const,
	list: () => [...studentQueryKeys.all, "list"] as const,
	detail: (id: string) => [...studentQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...studentQueryKeys.all, "detail", "idle"] as const,
};

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
