"use client";

import { useQuery } from "@tanstack/react-query";

import { listAreasOfExpertiseByProject } from "@/api/web/project/project-areas-of-expertise";
import { get, list } from "@/api/web/project/projects";
import { projectQueryKeys } from "@/constants";

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

export function useProjectAreasOfExpertiseQuery(projectId: string | null) {
	return useQuery({
		queryKey:
			projectId === null
				? projectQueryKeys.idleSchools()
				: projectQueryKeys.schools(projectId),
		queryFn: () => listAreasOfExpertiseByProject(projectId!),
		enabled: projectId !== null,
	});
}
