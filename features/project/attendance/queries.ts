"use client";

import { useQuery } from "@tanstack/react-query";

import { attendanceQueryKeys } from "@/constants/query-keys";

import { get, list } from "@/api/web/project/attendances";

export { attendanceQueryKeys };

export function useAttendancesQuery() {
	return useQuery({
		queryKey: attendanceQueryKeys.list(),
		queryFn: () => list(),
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
