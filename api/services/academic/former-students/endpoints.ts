import { z } from "zod";

import { API_ROUTE_BASES } from "@/api/services/constants";
import { qs, zfetch, zvoid } from "@/api/utils";
import {
	AccountStatusRequestSchema,
	createPageResponseSchema,
	FormerStudentComplexSearchRequestSchema,
	FormerStudentComplexSearchResponseSchema,
	FormerStudentResponseSchema,
} from "@/schemas/api";
import type {
	FormerStudentComplexSearchRequest,
	FormerStudentComplexSearchResponse,
	FormerStudentCreateRequest,
	FormerStudentResponse,
	FormerStudentUpdateRequest,
	PaginationRequest,
} from "@/types/api";

export async function get(
	id: string,
	token?: string,
): Promise<FormerStudentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.formerStudents}/${id}`,
		{ method: "GET" },
		FormerStudentResponseSchema,
		token,
	);
}

export async function getMe(token?: string): Promise<FormerStudentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.formerStudents}/me`,
		{ method: "GET" },
		FormerStudentResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<FormerStudentResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.academic.formerStudents}${qs({
			ids: ids?.join(","),
		})}`,
		{ method: "GET" },
		z.array(FormerStudentResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: FormerStudentComplexSearchRequest,
	token?: string,
): Promise<FormerStudentComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.formerStudents}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(FormerStudentComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(FormerStudentComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	body: FormerStudentCreateRequest,
	token?: string,
): Promise<FormerStudentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.formerStudents}`,
		{ method: "POST", body: JSON.stringify(body) },
		FormerStudentResponseSchema,
		token,
	);
}

export async function createBulk(
	body: FormerStudentCreateRequest[],
	token?: string,
): Promise<FormerStudentResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.academic.formerStudents}/bulk`,
		{ method: "POST", body: JSON.stringify(body) },
		z.array(FormerStudentResponseSchema),
		token,
	);
}

export async function update(
	id: string,
	body: FormerStudentUpdateRequest,
	token?: string,
): Promise<FormerStudentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.formerStudents}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		FormerStudentResponseSchema,
		token,
	);
}

export async function setActive(
	id: string,
	active: boolean,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.academic.formerStudents}/${id}/status`,
		{
			method: "PATCH",
			body: JSON.stringify(AccountStatusRequestSchema.parse({ active })),
		},
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.academic.formerStudents}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
