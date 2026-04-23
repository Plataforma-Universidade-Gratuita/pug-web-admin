import { z } from "zod";

import {
	ProjectResponseSchema,
	ProjectSchoolRequestSchema,
	SchoolResponseSchema,
} from "@/schemas/api";
import { webFetch, webVoid } from "@/utils/web-api";

import type { ProjectResponse, ProjectSchoolRequest, SchoolResponse } from "@/types/api";

const BASE = "/api/project/project-schools";

export async function listSchoolsByProject(projectId: string): Promise<SchoolResponse[]> {
	return webFetch(`${BASE}/projects/${projectId}/schools`, z.array(SchoolResponseSchema));
}

export async function listProjectsBySchool(schoolId: string): Promise<ProjectResponse[]> {
	return webFetch(`${BASE}/schools/${schoolId}/projects`, z.array(ProjectResponseSchema));
}

export async function createAssociations(body: ProjectSchoolRequest): Promise<SchoolResponse[]> {
	return webFetch(`${BASE}`, z.array(SchoolResponseSchema), {
		method: "POST",
		body: JSON.stringify(ProjectSchoolRequestSchema.parse(body)),
	});
}

export async function deleteAssociation(projectId: string, schoolId: string): Promise<void> {
	return webVoid(`${BASE}/projects/${projectId}/schools/${schoolId}`, { method: "DELETE" });
}

export async function deleteAllByProject(projectId: string): Promise<void> {
	return webVoid(`${BASE}/projects/${projectId}`, { method: "DELETE" });
}

export async function deleteAllBySchool(schoolId: string): Promise<void> {
	return webVoid(`${BASE}/schools/${schoolId}`, { method: "DELETE" });
}
