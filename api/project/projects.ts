import { z } from "zod";

import { ProjectResponseSchema } from "@/schemas/api/project/project";
import type {
	ProjectCreateRequest,
	ProjectResponse,
	ProjectUpdateRequest,
} from "@/types/api";
import { zfetch, zvoid, qs } from "@/utils/api";

const BASE = "/projects";

export async function get(
	id: string,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}/${id}`,
		{ method: "GET" },
		ProjectResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	q?: string,
	entityId?: string,
): Promise<ProjectResponse[]> {
	return zfetch(
		`${BASE}${qs({ q, entityId })}`,
		{ method: "GET" },
		z.array(ProjectResponseSchema),
		token,
	);
}

export async function listByCreatedBy(
	accountId: string,
	token?: string,
): Promise<ProjectResponse[]> {
	return zfetch(
		`${BASE}/created-by/${accountId}`,
		{ method: "GET" },
		z.array(ProjectResponseSchema),
		token,
	);
}

export async function create(
	body: ProjectCreateRequest,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}`,
		{ method: "POST", body: JSON.stringify(body) },
		ProjectResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: ProjectUpdateRequest,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		ProjectResponseSchema,
		token,
	);
}

export async function cancel(
	id: string,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}/${id}/cancel`,
		{ method: "PATCH" },
		ProjectResponseSchema,
		token,
	);
}

export async function complete(
	id: string,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}/${id}/complete`,
		{ method: "PATCH" },
		ProjectResponseSchema,
		token,
	);
}

export async function hold(
	id: string,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}/${id}/hold`,
		{ method: "PATCH" },
		ProjectResponseSchema,
		token,
	);
}

export async function retake(
	id: string,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}/${id}/retake`,
		{ method: "PATCH" },
		ProjectResponseSchema,
		token,
	);
}

export async function start(
	id: string,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${BASE}/${id}/start`,
		{ method: "PATCH" },
		ProjectResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(`${BASE}/${id}`, { method: "DELETE" }, token);
}
