import { z } from "zod";

import { API_ROUTE_BASES } from "@/api/services/constants";
import { zfetch, zvoid } from "@/api/services/utils";
import {
	AreaOfExpertiseResponseSchema,
	ProjectResponseSchema,
} from "@/schemas/api";
import type {
	AreaOfExpertiseResponse,
	ProjectAreaOfExpertiseRequest,
	ProjectResponse,
} from "@/types/api";

export async function listAreasOfExpertiseByProject(
	projectId: string,
	token?: string,
): Promise<AreaOfExpertiseResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${projectId}/areas-of-expertise`,
		{ method: "GET" },
		z.array(AreaOfExpertiseResponseSchema),
		token,
	);
}

export async function listProjectsByAreaOfExpertise(
	areaOfExpertiseId: string,
	token?: string,
): Promise<ProjectResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.academic.areasOfExpertise}/${areaOfExpertiseId}/projects`,
		{ method: "GET" },
		z.array(ProjectResponseSchema),
		token,
	);
}

export async function createAssociations(
	projectId: string,
	body: ProjectAreaOfExpertiseRequest,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.projects}/${projectId}/areas-of-expertise`,
		{ method: "POST", body: JSON.stringify(body) },
		token,
	);
}

export async function deleteAssociation(
	projectId: string,
	areaOfExpertiseId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.projects}/${projectId}/areas-of-expertise/${areaOfExpertiseId}`,
		{ method: "DELETE" },
		token,
	);
}

export async function deleteAllByProject(
	projectId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.projects}/${projectId}/areas-of-expertise`,
		{ method: "DELETE" },
		token,
	);
}

export async function deleteAllByAreaOfExpertise(
	areaOfExpertiseId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.academic.areasOfExpertise}/${areaOfExpertiseId}/projects`,
		{ method: "DELETE" },
		token,
	);
}
