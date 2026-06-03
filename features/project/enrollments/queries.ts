"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/project/enrollments";
import { enrollmentQueryKeys } from "@/constants";

export { enrollmentQueryKeys };

export function useEnrollmentsQuery() {
	return useQuery({
		queryKey: enrollmentQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useEnrollmentDetailQuery(
	projectId: string | null,
	formerStudentId: string | null,
) {
	return useQuery({
		queryKey:
			projectId === null || formerStudentId === null
				? enrollmentQueryKeys.idleDetail()
				: enrollmentQueryKeys.detail(projectId, formerStudentId),
		queryFn: () => get(projectId!, formerStudentId!),
		enabled: projectId !== null && formerStudentId !== null,
	});
}
