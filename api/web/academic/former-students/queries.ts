"use client";

import { useQuery } from "@tanstack/react-query";

import { formerStudents } from "@/api/web";

const { formerStudentKeys: keys, get, list } = formerStudents;

export function useFormerStudentsQuery() {
	return useQuery({
		queryKey: keys.list(),
		queryFn: () => list(),
	});
}

export function useFormerStudentDetailQuery(id: string | null) {
	return useQuery({
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}
