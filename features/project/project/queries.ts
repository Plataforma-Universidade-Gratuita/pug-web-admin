"use client";

import { useQuery } from "@tanstack/react-query";

import { listSchoolsByProject } from "@/api/web/project/project-schools";
import { get, list } from "@/api/web/project/projects";
import { projectQueryKeys } from "@/constants/query-keys";

export { projectQueryKeys };

export function useProjectsQuery() {
	return useQuery({
		queryKey: projectQueryKeys.list(),
		queryFn: () => list(),
	});
}

export function useProjectDetailQuery(id: string | null) {
	return useQuery({
		queryKey:
			id === null ? projectQueryKeys.idleDetail() : projectQueryKeys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useProjectSchoolsQuery(projectId: string | null) {
	return useQuery({
		queryKey:
			projectId === null
				? projectQueryKeys.idleSchools()
				: projectQueryKeys.schools(projectId),
		queryFn: () => listSchoolsByProject(projectId!),
		enabled: projectId !== null,
	});
}
