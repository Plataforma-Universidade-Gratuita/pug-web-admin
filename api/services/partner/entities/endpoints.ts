import { z } from "zod";

import { qs, zfetch, zvoid } from "@/api/utils";
import { API_ROUTE_BASES } from "@/constants";
import {
	EntityComplexSearchRequestSchema,
	EntityComplexSearchResponseSchema,
	EntityResponseSchema,
	createPageResponseSchema,
} from "@/schemas";
import type {
	EntityComplexSearchRequest,
	EntityComplexSearchResponse,
	EntityCreateRequest,
	EntityResponse,
	EntityUpdateRequest,
	PaginationRequest,
} from "@/types";

export async function get(id: string, token?: string): Promise<EntityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}/${id}`,
		{ method: "GET" },
		EntityResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<EntityResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}${qs({
			ids: ids?.join(","),
		})}`,
		{ method: "GET" },
		z.array(EntityResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: EntityComplexSearchRequest,
	token?: string,
): Promise<EntityComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(EntityComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(EntityComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: EntityCreateRequest,
	token?: string,
): Promise<EntityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}`,
		{ method: "POST", body: JSON.stringify(body) },
		EntityResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: EntityUpdateRequest,
	token?: string,
): Promise<EntityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		EntityResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.partner.entities}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
