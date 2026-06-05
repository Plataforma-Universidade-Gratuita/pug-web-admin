import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	CourseComplexSearchRequestSchema,
	CourseCreateRequestSchema,
	CourseResponseSchema,
	CourseUpdateRequestSchema,
	CourseWithAuditInfoComplexSearchResponseSchema,
	createPageResponseSchema,
} from "@/schemas";
import type {
	CourseComplexSearchRequest,
	CourseComplexSearchResponse,
	CourseCreateRequest,
	CourseResponse,
	CourseUpdateRequest,
	PaginationRequest,
} from "@/types";
import { qs, webFetch, webVoid } from "@/api/web/utils";

export async function get(id: string): Promise<CourseResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.courses}/${id}`,
		CourseResponseSchema,
	);
}

export async function list(ids?: string[]): Promise<CourseResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.courses}${qs({
			ids: ids?.join(","),
		})}`,
		z.array(CourseResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: CourseComplexSearchRequest,
): Promise<CourseComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.courses}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(CourseWithAuditInfoComplexSearchResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(CourseComplexSearchRequestSchema.parse(body)),
		},
	);
}

export async function create(
	body: CourseCreateRequest,
): Promise<CourseResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.courses}`,
		CourseResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(CourseCreateRequestSchema.parse(body)),
		},
	);
}

export async function update(
	id: string,
	body: CourseUpdateRequest,
): Promise<CourseResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.courses}/${id}`,
		CourseResponseSchema,
		{
			method: "PUT",
			body: JSON.stringify(CourseUpdateRequestSchema.parse(body)),
		},
	);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.academic.courses}/${id}`, {
		method: "DELETE",
	});
}

