import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	ProjectResponseSchema,
	ProjectSchoolAssociationUpdateRequestSchema,
	ProjectSchoolRequestSchema,
	SchoolResponseSchema,
} from "@/schemas";
import type {
	ProjectResponse,
	ProjectSchoolAssociationUpdateRequest,
	ProjectSchoolRequest,
	SchoolResponse,
} from "@/types";
import { webFetch, webVoid } from "@/utils";

export async function listSchoolsByProject(
	projectId: string,
): Promise<SchoolResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/schools`,
		z.array(SchoolResponseSchema),
	);
}

export async function listProjectsBySchool(
	schoolId: string,
): Promise<ProjectResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.schools}/${schoolId}/projects`,
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
		`${WEB_API_ROUTE_BASES.project.projects}/${body.projectId}/schools`,
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
	return webVoid(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/schools/${schoolId}`,
		{
			method: "DELETE",
		},
	);
}

export async function deleteAllByProject(projectId: string): Promise<void> {
	return webVoid(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/schools`,
		{ method: "DELETE" },
	);
}

export async function deleteAllBySchool(schoolId: string): Promise<void> {
	return webVoid(
		`${WEB_API_ROUTE_BASES.academic.schools}/${schoolId}/projects`,
		{ method: "DELETE" },
	);
}
