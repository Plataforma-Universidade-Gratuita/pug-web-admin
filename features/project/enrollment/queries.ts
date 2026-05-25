"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/project/enrollments";
import { enrollmentQueryKeys } from "@/constants/query-keys";

export { enrollmentQueryKeys };

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
