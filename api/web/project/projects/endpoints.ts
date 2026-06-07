import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/api/web/constants";
import { qs, webFetch, webVoid } from "@/api/web/utils";
import {
	ProjectComplexSearchRequestSchema,
	ProjectComplexSearchResponseSchema,
	ProjectCreateRequestSchema,
	ProjectResponseSchema,
	ProjectStatusEnum,
	ProjectUpdateRequestSchema,
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

export async function get(id: string): Promise<ProjectResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${id}`,
		ProjectResponseSchema,
	);
}

export async function list(ids?: string[]): Promise<ProjectResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}${qs({ ids: ids?.join(",") })}`,
		z.array(ProjectResponseSchema),
	);
}

export async function listByEntity(
	entityId: string,
): Promise<ProjectResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/entities/${entityId}`,
		z.array(ProjectResponseSchema),
	);
}

export async function listByCreatedBy(
	accountId: string,
): Promise<ProjectResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/creators/${accountId}`,
		z.array(ProjectResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: ProjectComplexSearchRequest,
): Promise<ProjectComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(ProjectComplexSearchResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(ProjectComplexSearchRequestSchema.parse(body)),
		},
	);
}

export async function create(
	body: ProjectCreateRequest,
): Promise<ProjectResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}`,
		ProjectResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(ProjectCreateRequestSchema.parse(body)),
		},
	);
}

export async function update(
	id: string,
	body: ProjectUpdateRequest,
): Promise<ProjectResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${id}`,
		ProjectResponseSchema,
		{
			method: "PUT",
			body: JSON.stringify(ProjectUpdateRequestSchema.parse(body)),
		},
	);
}

export async function updateStatus(
	id: string,
	status: ProjectStatus,
): Promise<ProjectResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${id}/status`,
		ProjectResponseSchema,
		{
			method: "PATCH",
			body: JSON.stringify(ProjectStatusEnum.parse(status)),
		},
	);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.project.projects}/${id}`, {
		method: "DELETE",
	});
}
