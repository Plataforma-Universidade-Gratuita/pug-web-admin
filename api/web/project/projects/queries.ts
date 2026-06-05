"use client";

import { useQuery } from "@tanstack/react-query";

import { projectAreasOfExpertise, projects } from "@/api/web";
import { buildProjectComplexSearchRequest } from "@/features/project/projects/utils";
import type { ProjectComplexSearchFilters } from "@/types";

const { listAreasOfExpertiseByProject } = projectAreasOfExpertise;
const { get, list, projectKeys: keys, search } = projects;

export function useProjectsQuery(enabled = true) {
	return useQuery({
		queryKey: keys.list(),
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
		queryKey: keys.search(page, size, filtersKey),
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
		queryKey: id === null ? keys.idleDetail() : keys.detail(id),
		queryFn: () => get(id!),
		enabled: id !== null,
	});
}

export function useProjectAreasOfExpertiseQuery(projectId: string | null) {
	return useQuery({
		queryKey:
			projectId === null
				? keys.idleAreasOfExpertise()
				: keys.areasOfExpertise(projectId),
		queryFn: () => listAreasOfExpertiseByProject(projectId!),
		enabled: projectId !== null,
	});
}
