"use client";

import { useQuery } from "@tanstack/react-query";

import { buildEnrollmentComplexSearchRequest } from "@/features/project/enrollments/utils";
import type { EnrollmentComplexSearchFilters } from "@/types";

import { get, list, search } from "./endpoints";
import { enrollmentKeys as keys } from "./keys";

export function useEnrollmentsQuery(enabled = true) {
	return useQuery({
		queryKey: keys.list(),
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
		queryKey: keys.search(page, size, filtersKey),
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
				? keys.idleDetail()
				: keys.detail(projectId, formerStudentId),
		queryFn: () => get(projectId!, formerStudentId!),
		enabled: projectId !== null && formerStudentId !== null,
	});
}
