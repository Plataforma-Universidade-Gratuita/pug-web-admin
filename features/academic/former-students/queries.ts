"use client";

import { useQuery } from "@tanstack/react-query";

import { get, list } from "@/api/web/academic/former-students";
import { formerStudentQueryKeys } from "@/constants";

export { formerStudentQueryKeys };

export function useFormerStudentsQuery() {
	return useQuery({
		queryKey: formerStudentQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useFormerStudentDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null
				? formerStudentQueryKeys.idleDetail()
				: formerStudentQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
