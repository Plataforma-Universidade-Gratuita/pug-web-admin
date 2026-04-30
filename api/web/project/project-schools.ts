import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import {
	ProjectResponseSchema,
	ProjectSchoolAssociationUpdateRequestSchema,
	ProjectSchoolRequestSchema,
	SchoolResponseSchema,
} from "@/schemas/api";
import type {
	ProjectResponse,
	ProjectSchoolAssociationUpdateRequest,
	ProjectSchoolRequest,
	SchoolResponse,
} from "@/types/api";
import { webFetch, webVoid } from "@/utils/web-api";

const PROJECTS_BASE = WEB_API_ROUTE_BASES.project.projects;
const SCHOOLS_BASE = WEB_API_ROUTE_BASES.academic.schools;

export async function listSchoolsByProject(
	projectId: string,
): Promise<SchoolResponse[]> {
	return webFetch(
		`${PROJECTS_BASE}/${projectId}/schools`,
		z.array(SchoolResponseSchema),
	);
}

export async function listProjectsBySchool(
	schoolId: string,
): Promise<ProjectResponse[]> {
	return webFetch(
		`${SCHOOLS_BASE}/${schoolId}/projects`,
		z.array(ProjectResponseSchema),
	);
}

export async function createAssociations(
	body: ProjectSchoolRequest,
): Promise<SchoolResponse[]> {
	const payload: ProjectSchoolAssociationUpdateRequest = {
		schoolIds: ProjectSchoolRequestSchema.parse(body).schoolIds,
	};
	return webFetch(
		`${PROJECTS_BASE}/${body.projectId}/schools`,
		z.array(SchoolResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(
				ProjectSchoolAssociationUpdateRequestSchema.parse(payload),
			),
		},
	);
}

export async function deleteAssociation(
	projectId: string,
	schoolId: string,
): Promise<void> {
	return webVoid(`${PROJECTS_BASE}/${projectId}/schools/${schoolId}`, {
		method: "DELETE",
	});
}

export async function deleteAllByProject(projectId: string): Promise<void> {
	return webVoid(`${PROJECTS_BASE}/${projectId}/schools`, { method: "DELETE" });
}

export async function deleteAllBySchool(schoolId: string): Promise<void> {
	return webVoid(`${SCHOOLS_BASE}/${schoolId}/projects`, { method: "DELETE" });
}
