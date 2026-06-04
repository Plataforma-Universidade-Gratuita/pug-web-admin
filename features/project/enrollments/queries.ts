"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list, search } from "@/api/web/project/enrollments";
import { enrollmentQueryKeys } from "@/constants";
import type { EnrollmentComplexSearchFilters } from "@/types";

import { buildEnrollmentComplexSearchRequest } from "./utils";

export { enrollmentQueryKeys };

export function useEnrollmentsQuery(enabled = true) {
	return useQuery({
		queryKey: enrollmentQueryKeys.list(),
		queryFn: () => list(),
		enabled,
	});
}

export function useEnrollmentsSearchQuery(
	page: number,
	size: number,
	filters: EnrollmentComplexSearchFilters,
	enabled = true,
) {
	const complexSearchRequest = buildEnrollmentComplexSearchRequest(filters);
	const filtersKey = JSON.stringify(complexSearchRequest);

	return useQuery({
		queryKey: enrollmentQueryKeys.search(page, size, filtersKey),
		queryFn: () =>
			search(
				{
					page,
					size,
				},
				complexSearchRequest,
			),
		enabled,
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
