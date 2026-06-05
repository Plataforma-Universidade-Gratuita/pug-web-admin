import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	AccountStatusRequestSchema,
	createPageResponseSchema,
	FormerStudentComplexSearchRequestSchema,
	FormerStudentComplexSearchResponseSchema,
	FormerStudentCreateRequestSchema,
	FormerStudentResponseSchema,
	FormerStudentUpdateRequestSchema,
} from "@/schemas";
import type {
	FormerStudentComplexSearchRequest,
	FormerStudentComplexSearchResponse,
	FormerStudentCreateRequest,
	FormerStudentResponse,
	FormerStudentUpdateRequest,
	PaginationRequest,
} from "@/types";
import { qs, webFetch, webVoid } from "@/api/web/utils";

export async function get(id: string): Promise<FormerStudentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}/${id}`,
		FormerStudentResponseSchema,
	);
}

export async function getMe(): Promise<FormerStudentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}/me`,
		FormerStudentResponseSchema,
	);
}

export async function list(ids?: string[]): Promise<FormerStudentResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}${qs({
			ids: ids?.join(","),
		})}`,
		z.array(FormerStudentResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: FormerStudentComplexSearchRequest,
): Promise<FormerStudentComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(FormerStudentComplexSearchResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(FormerStudentComplexSearchRequestSchema.parse(body)),
		},
	);
}

export async function create(
	body: FormerStudentCreateRequest,
): Promise<FormerStudentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}`,
		FormerStudentResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(FormerStudentCreateRequestSchema.parse(body)),
		},
	);
}

export async function createBulk(
	body: FormerStudentCreateRequest[],
): Promise<FormerStudentResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}/bulk`,
		z.array(FormerStudentResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(
				z.array(FormerStudentCreateRequestSchema).parse(body),
			),
		},
	);
}

export async function update(
	id: string,
	body: FormerStudentUpdateRequest,
): Promise<FormerStudentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}/${id}`,
		FormerStudentResponseSchema,
		{
			method: "PUT",
			body: JSON.stringify(FormerStudentUpdateRequestSchema.parse(body)),
		},
	);
}

export async function setActive(id: string, active: boolean): Promise<void> {
	return webVoid(
		`${WEB_API_ROUTE_BASES.academic.formerStudents}/${id}/status`,
		{
			method: "PATCH",
			body: JSON.stringify(AccountStatusRequestSchema.parse({ active })),
		},
	);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.academic.formerStudents}/${id}`, {
		method: "DELETE",
	});
}

