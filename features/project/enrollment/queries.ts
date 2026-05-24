"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/project/enrollments";

export const enrollmentQueryKeys = {
	all: ["project", "enrollment"] as const,
	list: () => [...enrollmentQueryKeys.all, "list"] as const,
	detail: (projectId: string, studentId: string) =>
		[...enrollmentQueryKeys.all, "detail", projectId, studentId] as const,
	idleDetail: () =>
		[...enrollmentQueryKeys.all, "detail", "idle", "idle"] as const,
};

export function useEnrollmentsQuery() {
	return useQuery({
		queryKey: enrollmentQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useEnrollmentDetailQuery(
	projectId: string | null,
	studentId: string | null,
) {
	return useQuery({
		queryKey:
			projectId === null || studentId === null
				? enrollmentQueryKeys.idleDetail()
				: enrollmentQueryKeys.detail(projectId, studentId),
		queryFn: () => get(projectId!, studentId!),
		enabled: projectId !== null && studentId !== null,
	});
}
