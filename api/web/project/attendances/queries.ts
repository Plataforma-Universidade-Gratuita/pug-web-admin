"use client";

import { useQuery } from "@tanstack/react-query";

import { attendances } from "@/api/web";
import { buildAttendanceComplexSearchRequest } from "@/features/project/attendances/utils";
import type { AttendanceComplexSearchFilters } from "@/types";

const { attendanceKeys: keys, get, list, search } = attendances;

export function useAttendancesQuery(enabled = true) {
	return useQuery({
		queryKey: keys.list(),
		queryFn: () => list(),
		enabled,
	});
}

export function useAttendancesSearchQuery(
	page: number,
	size: number,
	filters: AttendanceComplexSearchFilters,
	enabled = true,
) {
	const complexSearchRequest = buildAttendanceComplexSearchRequest(filters);
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

export function useAttendanceDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
