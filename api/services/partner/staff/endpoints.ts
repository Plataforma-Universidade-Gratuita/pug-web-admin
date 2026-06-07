import { z } from "zod";

import { qs, zfetch, zvoid } from "@/api/utils";
import { API_ROUTE_BASES } from "@/constants";
import {
	AccountStatusRequestSchema,
	StaffComplexSearchRequestSchema,
	StaffComplexSearchResponseSchema,
	StaffResponseSchema,
	createPageResponseSchema,
} from "@/schemas";
import type {
	PaginationRequest,
	StaffComplexSearchRequest,
	StaffComplexSearchResponse,
	StaffCreateRequest,
	StaffResponse,
	StaffUpdateRequest,
} from "@/types";

export async function get(id: string, token?: string): Promise<StaffResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.staff}/${id}`,
		{ method: "GET" },
		StaffResponseSchema,
		token,
	);
}

export async function getMe(token?: string): Promise<StaffResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.staff}/me`,
		{ method: "GET" },
		StaffResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<StaffResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.partner.staff}${qs({
			ids: ids?.join(","),
		})}`,
		{ method: "GET" },
		z.array(StaffResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: StaffComplexSearchRequest,
	token?: string,
): Promise<StaffComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.staff}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(StaffComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(StaffComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: StaffCreateRequest,
	token?: string,
): Promise<StaffResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.staff}`,
		{ method: "POST", body: JSON.stringify(body) },
		StaffResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: StaffUpdateRequest,
	token?: string,
): Promise<StaffResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.staff}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		StaffResponseSchema,
		token,
	);
}

export async function setActive(
	id: string,
	active: boolean,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.partner.staff}/${id}/status`,
		{
			method: "PATCH",
			body: JSON.stringify(AccountStatusRequestSchema.parse({ active })),
		},
		token,
	);
}

export async function deactivate(id: string, token?: string): Promise<void> {
	return setActive(id, false, token);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.partner.staff}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
