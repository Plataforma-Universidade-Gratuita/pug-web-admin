import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	ProjectCreateRequestSchema,
	ProjectResponseSchema,
	ProjectUpdateRequestSchema,
} from "@/schemas";
import type {
	ProjectCreateRequest,
	ProjectResponse,
	ProjectStatus,
	ProjectUpdateRequest,
} from "@/types";
import { qs, webFetch, webVoid } from "@/utils";

export async function get(id: string): Promise<ProjectResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${id}`,
		ProjectResponseSchema,
	);
}

export async function list(
	q?: string,
	entityId?: string,
): Promise<ProjectResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}${qs({ q, entityId })}`,
		z.array(ProjectResponseSchema),
	);
}

export async function listByCreatedBy(
	accountId: string,
): Promise<ProjectResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}${qs({ createdBy: accountId })}`,
		z.array(ProjectResponseSchema),
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

async function updateStatus(
	id: string,
	status: ProjectStatus,
): Promise<ProjectResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${id}`,
		ProjectResponseSchema,
		{
			method: "PATCH",
			body: JSON.stringify({ status }),
		},
	);
}

export async function cancel(id: string): Promise<ProjectResponse> {
	return updateStatus(id, "CANCELED");
}

export async function complete(id: string): Promise<ProjectResponse> {
	return updateStatus(id, "COMPLETED");
}

export async function hold(id: string): Promise<ProjectResponse> {
	return updateStatus(id, "ON_HOLD");
}

export async function retake(id: string): Promise<ProjectResponse> {
	return updateStatus(id, "PLANNED");
}

export async function start(id: string): Promise<ProjectResponse> {
	return updateStatus(id, "IN_PROGRESS");
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.project.projects}/${id}`, {
		method: "DELETE",
	});
}
