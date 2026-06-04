"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list, search } from "@/api/web/project/attendances";
import { attendanceQueryKeys } from "@/constants";
import type { AttendanceComplexSearchFilters } from "@/types";

import { buildAttendanceComplexSearchRequest } from "./utils";

export { attendanceQueryKeys };

export function useAttendancesQuery(enabled = true) {
	return useQuery({
		queryKey: attendanceQueryKeys.list(),
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
		queryKey: attendanceQueryKeys.search(page, size, filtersKey),
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
		queryKey:
			id === null
				? attendanceQueryKeys.idleDetail()
				: attendanceQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
