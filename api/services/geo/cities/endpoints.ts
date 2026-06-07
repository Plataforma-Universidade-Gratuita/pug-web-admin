import { z } from "zod";

import { qs, zfetch } from "@/api/utils";
import { API_ROUTE_BASES } from "@/constants";
import {
	CityComplexSearchRequestSchema,
	CityResponseSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type {
	CityComplexSearchRequest,
	CityComplexSearchResponse,
	CityResponse,
	PaginationRequest,
} from "@/types/api";

export async function get(id: string, token?: string): Promise<CityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.geo.cities}/${id}`,
		{ method: "GET" },
		CityResponseSchema,
		token,
	);
}

export async function list(token?: string): Promise<CityResponse[]> {
	return zfetch(
		API_ROUTE_BASES.geo.cities,
		{ method: "GET" },
		z.array(CityResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: CityComplexSearchRequest,
	token?: string,
): Promise<CityComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.geo.cities}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(CityComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(CityResponseSchema),
		token,
	);
}
