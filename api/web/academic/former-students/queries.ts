"use client";

import { useQuery } from "@tanstack/react-query";

import { formerStudentQueryKeys } from "@/constants";

import { get, list } from "./endpoints";

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
