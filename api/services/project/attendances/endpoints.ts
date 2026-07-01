import { z } from "zod";

import { API_ROUTE_BASES } from "@/api/services/constants";
import { zfetch, zvoid } from "@/api/services/utils";
import { qs } from "@/api/utils";
import {
	AttendanceComplexSearchRequestSchema,
	AttendanceComplexSearchResponseSchema,
	AttendanceResponseSchema,
	createPageResponseSchema,
} from "@/schemas/api";
import type {
	AttendanceComplexSearchRequest,
	AttendanceComplexSearchResponse,
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceValidateRequest,
	PaginationRequest,
} from "@/types/api";

export async function get(
	id: string,
	token?: string,
): Promise<AttendanceResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.attendances}/${id}`,
		{ method: "GET" },
		AttendanceResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<AttendanceResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.project.attendances}${qs({ ids })}`,
		{ method: "GET" },
		z.array(AttendanceResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: AttendanceComplexSearchRequest,
	token?: string,
): Promise<AttendanceComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.attendances}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(AttendanceComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(AttendanceComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: AttendanceCreateRequest,
	token?: string,
): Promise<AttendanceResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.attendances}`,
		{ method: "POST", body: JSON.stringify(body) },
		AttendanceResponseSchema,
		token,
	);
}

export async function validate(
	id: string,
	body: AttendanceValidateRequest,
	token?: string,
): Promise<AttendanceResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.attendances}/${id}/validate`,
		{ method: "PATCH", body: JSON.stringify(body) },
		AttendanceResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.attendances}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
