"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/project/attendances";
import { attendanceQueryKeys } from "@/constants";

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
