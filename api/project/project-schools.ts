import { z } from "zod";

import { SchoolResponseSchema } from "@/schemas/api/academic/school";
import { ProjectResponseSchema } from "@/schemas/api/project/project";
import { zfetch, zvoid } from "@/utils/api";

import type { ProjectSchoolRequest, SchoolResponse, ProjectResponse } from "@/types/api";

const BASE = "/projects/by-school";

export async function listSchoolsByProject(projectId: string, token?: string): Promise<SchoolResponse[]> {
  return zfetch(`${BASE}/projects/${projectId}/schools`, { method: "GET" }, z.array(SchoolResponseSchema), token);
}

export async function listProjectsBySchool(schoolId: string, token?: string): Promise<ProjectResponse[]> {
  return zfetch(`${BASE}/schools/${schoolId}/projects`, { method: "GET" }, z.array(ProjectResponseSchema), token);
}

export async function createAssociations(body: ProjectSchoolRequest, token?: string): Promise<SchoolResponse[]> {
  return zfetch(`${BASE}`, { method: "POST", body: JSON.stringify(body) }, z.array(SchoolResponseSchema), token);
}

export async function deleteAssociation(projectId: string, schoolId: string, token?: string): Promise<void> {
  return zvoid(`${BASE}/projects/${projectId}/schools/${schoolId}`, { method: "DELETE" }, token);
}

export async function deleteAllByProject(projectId: string, token?: string): Promise<void> {
  return zvoid(`${BASE}/projects/${projectId}`, { method: "DELETE" }, token);
}

export async function deleteAllBySchool(schoolId: string, token?: string): Promise<void> {
  return zvoid(`${BASE}/schools/${schoolId}`, { method: "DELETE" }, token);
}


