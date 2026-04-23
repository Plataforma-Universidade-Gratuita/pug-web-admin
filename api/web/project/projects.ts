import { z } from "zod";

import {
	ProjectCreateRequestSchema,
	ProjectResponseSchema,
	ProjectUpdateRequestSchema,
} from "@/schemas/api";
import { webFetch, webVoid } from "@/utils/web-api";

import type { ProjectCreateRequest, ProjectResponse, ProjectUpdateRequest } from "@/types/api";

const BASE = "/api/project/projects";

export async function get(id: string): Promise<ProjectResponse> {
	return webFetch(`${BASE}/${id}`, ProjectResponseSchema);
}

export async function list(q?: string, entityId?: string): Promise<ProjectResponse[]> {
	const params = new URLSearchParams();
	if (q) params.set("q", q);
	if (entityId) params.set("entityId", entityId);
	const search = params.toString();
	return webFetch(`${BASE}${search ? `?${search}` : ""}`, z.array(ProjectResponseSchema));
}

export async function listByCreatedBy(accountId: string): Promise<ProjectResponse[]> {
	return webFetch(`${BASE}/created-by/${accountId}`, z.array(ProjectResponseSchema));
}

export async function create(body: ProjectCreateRequest): Promise<ProjectResponse> {
	return webFetch(`${BASE}`, ProjectResponseSchema, {
		method: "POST",
		body: JSON.stringify(ProjectCreateRequestSchema.parse(body)),
	});
}

export async function update(id: string, body: ProjectUpdateRequest): Promise<ProjectResponse> {
	return webFetch(`${BASE}/${id}`, ProjectResponseSchema, {
		method: "PUT",
		body: JSON.stringify(ProjectUpdateRequestSchema.parse(body)),
	});
}

export async function cancel(id: string): Promise<ProjectResponse> {
	return webFetch(`${BASE}/${id}/cancel`, ProjectResponseSchema, { method: "PATCH" });
}

export async function complete(id: string): Promise<ProjectResponse> {
	return webFetch(`${BASE}/${id}/complete`, ProjectResponseSchema, { method: "PATCH" });
}

export async function hold(id: string): Promise<ProjectResponse> {
	return webFetch(`${BASE}/${id}/hold`, ProjectResponseSchema, { method: "PATCH" });
}

export async function retake(id: string): Promise<ProjectResponse> {
	return webFetch(`${BASE}/${id}/retake`, ProjectResponseSchema, { method: "PATCH" });
}

export async function start(id: string): Promise<ProjectResponse> {
	return webFetch(`${BASE}/${id}/start`, ProjectResponseSchema, { method: "PATCH" });
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}`, { method: "DELETE" });
}
