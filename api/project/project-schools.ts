import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants/api";
import { SchoolResponseSchema } from "@/schemas/api/academic/school";
import { ProjectResponseSchema } from "@/schemas/api/project/project";
import type {
	ProjectSchoolRequest,
	SchoolResponse,
	ProjectResponse,
} from "@/types/api";
import { zfetch, zvoid } from "@/utils/api";

const BASE = API_ROUTE_BASES.project.projectSchools;

export async function listSchoolsByProject(
	projectId: string,
	token?: string,
): Promise<SchoolResponse[]> {
	return zfetch(
		`${BASE}/projects/${projectId}/schools`,
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
		`${BASE}/schools/${schoolId}/projects`,
		{ method: "GET" },
		z.array(ProjectResponseSchema),
		token,
	);
}

export async function createAssociations(
	body: ProjectSchoolRequest,
	token?: string,
): Promise<SchoolResponse[]> {
	return zfetch(
		`${BASE}`,
		{ method: "POST", body: JSON.stringify(body) },
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
		`${BASE}/projects/${projectId}/schools/${schoolId}`,
		{ method: "DELETE" },
		token,
	);
}

export async function deleteAllByProject(
	projectId: string,
	token?: string,
): Promise<void> {
	return zvoid(`${BASE}/projects/${projectId}`, { method: "DELETE" }, token);
}

export async function deleteAllBySchool(
	schoolId: string,
	token?: string,
): Promise<void> {
	return zvoid(`${BASE}/schools/${schoolId}`, { method: "DELETE" }, token);
}
