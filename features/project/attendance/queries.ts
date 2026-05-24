"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/project/attendances";

export const attendanceQueryKeys = {
	all: ["project", "attendance"] as const,
	list: () => [...attendanceQueryKeys.all, "list"] as const,
	detail: (id: string) => [...attendanceQueryKeys.all, "detail", id] as const,
	idleDetail: () => [...attendanceQueryKeys.all, "detail", "idle"] as const,
};

export function useAttendancesQuery() {
	return useQuery({
		queryKey: attendanceQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useAttendanceDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? attendanceQueryKeys.idleDetail() : attendanceQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
