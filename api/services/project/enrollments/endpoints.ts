import { z } from "zod";

import { qs, zfetch, zvoid } from "@/api/utils";
import { API_ROUTE_BASES } from "@/constants";
import {
	EnrollmentComplexSearchRequestSchema,
	EnrollmentComplexSearchResponseSchema,
	EnrollmentResponseSchema,
	EnrollmentUpdateStatusRequestSchema,
	createPageResponseSchema,
} from "@/schemas";
import type {
	EnrollmentComplexSearchRequest,
	EnrollmentComplexSearchResponse,
	EnrollmentResponse,
	EnrollmentStatus,
	PaginationRequest,
} from "@/types";

export async function get(
	projectId: string,
	formerStudentId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${formerStudentId}`,
		{ method: "GET" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function getMine(
	projectId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${projectId}/enrollments/me`,
		{ method: "GET" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	projectId?: string,
	formerStudentId?: string,
): Promise<EnrollmentResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.project.enrollments}${qs({
			projectId,
			formerStudentId,
		})}`,
		{ method: "GET" },
		z.array(EnrollmentResponseSchema),
		token,
	);
}

export async function listMine(token?: string): Promise<EnrollmentResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.project.enrollments}/me`,
		{ method: "GET" },
		z.array(EnrollmentResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: EnrollmentComplexSearchRequest,
	token?: string,
): Promise<EnrollmentComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.enrollments}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(EnrollmentComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(EnrollmentComplexSearchResponseSchema),
		token,
	);
}

export async function create(
	projectId: string,
	formerStudentId?: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${projectId}/enrollments${qs({
			formerStudentId,
		})}`,
		{ method: "POST" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function updateStatus(
	projectId: string,
	formerStudentId: string,
	status: EnrollmentStatus,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${formerStudentId}`,
		{
			method: "PATCH",
			body: JSON.stringify(
				EnrollmentUpdateStatusRequestSchema.parse({ status }),
			),
		},
		EnrollmentResponseSchema,
		token,
	);
}

export async function updateMyStatus(
	projectId: string,
	status: EnrollmentStatus,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${API_ROUTE_BASES.project.projects}/${projectId}/enrollments/me`,
		{
			method: "PATCH",
			body: JSON.stringify(
				EnrollmentUpdateStatusRequestSchema.parse({ status }),
			),
		},
		EnrollmentResponseSchema,
		token,
	);
}

export async function deleteEnrollment(
	projectId: string,
	formerStudentId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${formerStudentId}`,
		{ method: "DELETE" },
		token,
	);
}
