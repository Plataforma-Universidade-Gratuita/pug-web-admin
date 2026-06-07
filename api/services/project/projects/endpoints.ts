import { z } from "zod";

import { API_ROUTE_BASES } from "@/api/services/constants";
import { zfetch, zvoid } from "@/api/services/utils";
import { qs } from "@/api/utils";
import {
	ProjectComplexSearchRequestSchema,
	ProjectComplexSearchResponseSchema,
	ProjectResponseSchema,
	ProjectStatusEnum,
	createPageResponseSchema,
} from "@/schemas/api";
import type {
	PaginationRequest,
	ProjectComplexSearchRequest,
	ProjectComplexSearchResponse,
	ProjectCreateRequest,
	ProjectResponse,
	ProjectStatus,
	ProjectUpdateRequest,
} from "@/types/api";

export async function get(
	id: string,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${id}`,
		{ method: "GET" },
		ProjectResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<ProjectResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}${qs({ ids: ids?.join(",") })}`,
		{ method: "GET" },
		z.array(ProjectResponseSchema),
		token,
	);
}

export async function listByEntity(
	entityId: string,
	token?: string,
): Promise<ProjectResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/entities/${entityId}`,
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
		`${API_ROUTE_BASES.project.projects}/creators/${accountId}`,
		{ method: "GET" },
		z.array(ProjectResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: ProjectComplexSearchRequest,
	token?: string,
): Promise<ProjectComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(ProjectComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(ProjectComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: ProjectCreateRequest,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}`,
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
		`${API_ROUTE_BASES.project.projects}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		ProjectResponseSchema,
		token,
	);
}

export async function updateStatus(
	id: string,
	status: ProjectStatus,
	token?: string,
): Promise<ProjectResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${id}/status`,
		{ method: "PATCH", body: JSON.stringify(ProjectStatusEnum.parse(status)) },
		ProjectResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.projects}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
