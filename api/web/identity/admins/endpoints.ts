import { z } from "zod";

import { qs } from "@/api/utils";
import { WEB_API_ROUTE_BASES } from "@/api/web/constants";
import { webFetch, webVoid } from "@/api/web/utils";
import {
	AdminComplexSearchRequestSchema,
	AdminComplexSearchResponseSchema,
	AdminCreateRequestSchema,
	AdminResponseSchema,
	AdminUpdateRequestSchema,
	AccountStatusRequestSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type {
	AdminComplexSearchRequest,
	AdminComplexSearchResponse,
	AdminCreateRequest,
	AdminResponse,
	AdminUpdateRequest,
	PaginationRequest,
} from "@/types/api";

export async function get(id: string): Promise<AdminResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.admins}/${id}`,
		AdminResponseSchema,
	);
}

export async function getMe(): Promise<AdminResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.admins}/me`,
		AdminResponseSchema,
	);
}

export async function list(ids?: string[]): Promise<AdminResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.admins}${qs({
			ids: ids?.join(","),
		})}`,
		z.array(AdminResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: AdminComplexSearchRequest,
): Promise<AdminComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.admins}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(AdminComplexSearchResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(AdminComplexSearchRequestSchema.parse(body)),
		},
	);
}

export async function create(body: AdminCreateRequest): Promise<AdminResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.admins}`,
		AdminResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(AdminCreateRequestSchema.parse(body)),
		},
	);
}

export async function update(
	id: string,
	body: AdminUpdateRequest,
): Promise<AdminResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.admins}/${id}`,
		AdminResponseSchema,
		{
			method: "PUT",
			body: JSON.stringify(AdminUpdateRequestSchema.parse(body)),
		},
	);
}

export async function setActive(id: string, active: boolean): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.identity.admins}/${id}/status`, {
		method: "PATCH",
		body: JSON.stringify(AccountStatusRequestSchema.parse({ active })),
	});
}

export async function deactivate(id: string): Promise<void> {
	return setActive(id, false);
}

export async function reactivate(id: string): Promise<void> {
	return setActive(id, true);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.identity.admins}/${id}`, {
		method: "DELETE",
	});
}
