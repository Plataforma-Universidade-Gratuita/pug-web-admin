import { z } from "zod";

import { API_ROUTE_BASES } from "@/api/services/constants";
import { zfetch, zvoid } from "@/api/services/utils";
import { qs } from "@/api/utils";
import {
	AreaOfExpertiseComplexSearchRequestSchema,
	AreaOfExpertiseComplexSearchResponseSchema,
	AreaOfExpertiseResponseSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type {
	AreaOfExpertiseComplexSearchRequest,
	AreaOfExpertiseComplexSearchResponse,
	AreaOfExpertiseCreateRequest,
	AreaOfExpertiseResponse,
	AreaOfExpertiseUpdateRequest,
	PaginationRequest,
} from "@/types/api";

export async function get(
	id: string,
	token?: string,
): Promise<AreaOfExpertiseResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.areasOfExpertise}/${id}`,
		{ method: "GET" },
		AreaOfExpertiseResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<AreaOfExpertiseResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.academic.areasOfExpertise}${qs({
			ids,
		})}`,
		{ method: "GET" },
		z.array(AreaOfExpertiseResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: AreaOfExpertiseComplexSearchRequest,
	token?: string,
): Promise<AreaOfExpertiseComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.areasOfExpertise}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(
				AreaOfExpertiseComplexSearchRequestSchema.parse(body),
			),
		},
		createPageResponseSchema(AreaOfExpertiseComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: AreaOfExpertiseCreateRequest,
	token?: string,
): Promise<AreaOfExpertiseResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.areasOfExpertise}`,
		{ method: "POST", body: JSON.stringify(body) },
		AreaOfExpertiseResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: AreaOfExpertiseUpdateRequest,
	token?: string,
): Promise<AreaOfExpertiseResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.areasOfExpertise}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		AreaOfExpertiseResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.academic.areasOfExpertise}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
