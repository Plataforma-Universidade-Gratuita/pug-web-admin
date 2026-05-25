import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import { EnrollmentResponseSchema } from "@/schemas/api";
import type {
	EnrollmentCreateRequest,
	EnrollmentResponse,
	EnrollmentStatus,
} from "@/types/api";
import { qs } from "@/utils/api";
import { webFetch, webVoid } from "@/utils/web-api";


export async function get(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${studentId}`,
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
	studentId?: string,
): Promise<EnrollmentResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.enrollments}${qs({ projectId, studentId })}`,
		z.array(EnrollmentResponseSchema),
	);
}

export async function listMine(): Promise<EnrollmentResponse[]> {
	return webFetch(`${WEB_API_ROUTE_BASES.project.enrollments}/me`, z.array(EnrollmentResponseSchema));
}

export async function create(
	body: EnrollmentCreateRequest,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${body.projectId}/enrollments`,
		EnrollmentResponseSchema,
		{
			method: "POST",
		},
	);
}

async function updateStatus(
	projectId: string,
	studentId: string,
	status: EnrollmentStatus,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${studentId}`,
		EnrollmentResponseSchema,
		{ method: "PATCH", body: JSON.stringify({ status }) },
	);
}

async function updateMyStatus(
	projectId: string,
	status: EnrollmentStatus,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/me`,
		EnrollmentResponseSchema,
		{
			method: "PATCH",
			body: JSON.stringify({ status }),
		},
	);
}

export async function accept(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return updateStatus(projectId, studentId, "APPROVED");
}

export async function cancel(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return updateStatus(projectId, studentId, "CANCELED");
}

export async function complete(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return updateStatus(projectId, studentId, "COMPLETED");
}

export async function exit(projectId: string): Promise<EnrollmentResponse> {
	return updateMyStatus(projectId, "EXITED");
}

export async function reject(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return updateStatus(projectId, studentId, "REJECTED");
}

export async function remove(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return updateStatus(projectId, studentId, "REMOVED");
}

export async function deleteEnrollment(
	projectId: string,
	studentId: string,
): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.project.projects}/${projectId}/enrollments/${studentId}`, {
		method: "DELETE",
	});
}
