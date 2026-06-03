"use client";

import { useQuery } from "@tanstack/react-query";

import { listAreasOfExpertiseByProject } from "@/api/web/project/project-areas-of-expertise";
import { get, list, search } from "@/api/web/project/projects";
import { projectQueryKeys } from "@/constants";
import type { ProjectComplexSearchFilters } from "@/types";

import { buildProjectComplexSearchRequest } from "./utils";

export { projectQueryKeys };

export function useProjectsQuery(enabled = true) {
	return useQuery({
		queryKey: projectQueryKeys.list(),
		queryFn: () => list(),
		enabled,
	});
}

export function useProjectsSearchQuery(
	page: number,
	size: number,
	filters: ProjectComplexSearchFilters,
	enabled = true,
) {
	const complexSearchRequest = buildProjectComplexSearchRequest(filters);
	const filtersKey = JSON.stringify(complexSearchRequest);

	return useQuery({
		queryKey: projectQueryKeys.search(page, size, filtersKey),
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
				? projectQueryKeys.idleAreasOfExpertise()
				: projectQueryKeys.areasOfExpertise(projectId),
		queryFn: () => listAreasOfExpertiseByProject(projectId!),
		enabled: projectId !== null,
	});
}
