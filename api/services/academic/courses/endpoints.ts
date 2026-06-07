import { z } from "zod";

import { API_ROUTE_BASES } from "@/api/services/constants";
import { zfetch, zvoid } from "@/api/services/utils";
import { qs } from "@/api/utils";
import {
	CourseComplexSearchRequestSchema,
	CourseResponseSchema,
	CourseWithAuditInfoComplexSearchResponseSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type {
	CourseComplexSearchRequest,
	CourseComplexSearchResponse,
	CourseCreateRequest,
	CourseResponse,
	CourseUpdateRequest,
	PaginationRequest,
} from "@/types/api";

export async function get(id: string, token?: string): Promise<CourseResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.courses}/${id}`,
		{ method: "GET" },
		CourseResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<CourseResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.academic.courses}${qs({
			ids: ids?.join(","),
		})}`,
		{ method: "GET" },
		z.array(CourseResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: CourseComplexSearchRequest,
	token?: string,
): Promise<CourseComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.courses}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(CourseComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(CourseWithAuditInfoComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: CourseCreateRequest,
	token?: string,
): Promise<CourseResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.courses}`,
		{ method: "POST", body: JSON.stringify(body) },
		CourseResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: CourseUpdateRequest,
	token?: string,
): Promise<CourseResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.courses}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		CourseResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.academic.courses}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
