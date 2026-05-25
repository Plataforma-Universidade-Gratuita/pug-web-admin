import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants";
import { SchoolResponseSchema } from "@/schemas";
import { ProjectResponseSchema } from "@/schemas";
import type {
	ProjectSchoolAssociationUpdateRequest,
	ProjectSchoolRequest,
	SchoolResponse,
	ProjectResponse,
} from "@/types";
import { zfetch, zvoid } from "@/utils";

export async function listSchoolsByProject(
	projectId: string,
	token?: string,
): Promise<SchoolResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${projectId}/schools`,
		{ method: "GET" },
		z.array(SchoolResponseSchema),
		token,
	);
}

export async function listProjectsBySchool(
	schoolId: string,
	token?: string,
): Promise<ProjectResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.academic.schools}/${schoolId}/projects`,
		{ method: "GET" },
		z.array(ProjectResponseSchema),
		token,
	);
}

export async function createAssociations(
	body: ProjectSchoolRequest,
	token?: string,
): Promise<SchoolResponse[]> {
	const payload: ProjectSchoolAssociationUpdateRequest = {
		schoolIds: body.schoolIds,
	};
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${body.projectId}/schools`,
		{ method: "POST", body: JSON.stringify(payload) },
		z.array(SchoolResponseSchema),
		token,
	);
}

export async function deleteAssociation(
	projectId: string,
	schoolId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.projects}/${projectId}/schools/${schoolId}`,
		{ method: "DELETE" },
		token,
	);
}

export async function deleteAllByProject(
	projectId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.projects}/${projectId}/schools`,
		{ method: "DELETE" },
		token,
	);
}

export async function deleteAllBySchool(
	schoolId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.academic.schools}/${schoolId}/projects`,
		{ method: "DELETE" },
		token,
	);
}
