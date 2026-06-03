import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants";
import {
	AdminComplexSearchRequestSchema,
	AdminComplexSearchResponseSchema,
	AdminResponseSchema,
	AccountStatusRequestSchema,
	createPageResponseSchema,
} from "@/schemas";
import type {
	AdminComplexSearchRequest,
	AdminComplexSearchResponse,
	AdminCreateRequest,
	AdminResponse,
	AdminUpdateRequest,
	PaginationRequest,
} from "@/types";
import { qs, zfetch, zvoid } from "@/utils";

export async function get(id: string, token?: string): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}/${id}`,
		{ method: "GET" },
		AdminResponseSchema,
		token,
	);
}

export async function getMe(token?: string): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}/me`,
		{ method: "GET" },
		AdminResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<AdminResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}${qs({
			ids: ids?.join(","),
		})}`,
		{ method: "GET" },
		z.array(AdminResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: AdminComplexSearchRequest,
	token?: string,
): Promise<AdminComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(AdminComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(AdminComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: AdminCreateRequest,
	token?: string,
): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}`,
		{ method: "POST", body: JSON.stringify(body) },
		AdminResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: AdminUpdateRequest,
	token?: string,
): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		AdminResponseSchema,
		token,
	);
}

export async function setActive(
	id: string,
	active: boolean,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.identity.admins}/${id}/status`,
		{
			method: "PATCH",
			body: JSON.stringify(AccountStatusRequestSchema.parse({ active })),
		},
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.identity.admins}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
