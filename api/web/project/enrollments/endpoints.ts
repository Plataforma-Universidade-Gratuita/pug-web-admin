import { z } from "zod";

import { qs, webFetch, webVoid } from "@/api/web/utils";
import { WEB_API_ROUTE_BASES } from "@/constants";
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
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${formerStudentId}`,
		EnrollmentResponseSchema,
	);
}

export async function getMine(projectId: string): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/me`,
		EnrollmentResponseSchema,
	);
}

export async function list(
	projectId?: string,
	formerStudentId?: string,
): Promise<EnrollmentResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.enrollments}${qs({
			projectId,
			formerStudentId,
		})}`,
		z.array(EnrollmentResponseSchema),
	);
}

export async function listMine(): Promise<EnrollmentResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.enrollments}/me`,
		z.array(EnrollmentResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: EnrollmentComplexSearchRequest,
): Promise<EnrollmentComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.enrollments}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(EnrollmentComplexSearchResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(EnrollmentComplexSearchRequestSchema.parse(body)),
		},
	);
}

export async function create(
	projectId: string,
	formerStudentId?: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments${qs({
			formerStudentId,
		})}`,
		EnrollmentResponseSchema,
		{
			method: "POST",
		},
	);
}

export async function updateStatus(
	projectId: string,
	formerStudentId: string,
	status: EnrollmentStatus,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${formerStudentId}`,
		EnrollmentResponseSchema,
		{
			method: "PATCH",
			body: JSON.stringify(
				EnrollmentUpdateStatusRequestSchema.parse({ status }),
			),
		},
	);
}

export async function updateMyStatus(
	projectId: string,
	status: EnrollmentStatus,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/me`,
		EnrollmentResponseSchema,
		{
			method: "PATCH",
			body: JSON.stringify(
				EnrollmentUpdateStatusRequestSchema.parse({ status }),
			),
		},
	);
}

export async function deleteEnrollment(
	projectId: string,
	formerStudentId: string,
): Promise<void> {
	return webVoid(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${formerStudentId}`,
		{
			method: "DELETE",
		},
	);
}
