import { z } from "zod";

import { EnrollmentResponseSchema } from "@/schemas/api/project/enrollment";
import type { EnrollmentCreateRequest, EnrollmentResponse } from "@/types/api";
import { zfetch, zvoid, qs } from "@/utils/api";

const BASE = "/projects/enrollments";

export async function get(
	projectId: string,
	studentId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}/${projectId}/${studentId}`,
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
		`${BASE}/${projectId}/me`,
		{ method: "GET" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	projectId?: string,
	studentId?: string,
): Promise<EnrollmentResponse[]> {
	return zfetch(
		`${BASE}${qs({ projectId, studentId })}`,
		{ method: "GET" },
		z.array(EnrollmentResponseSchema),
		token,
	);
}

export async function listMine(token?: string): Promise<EnrollmentResponse[]> {
	return zfetch(
		`${BASE}/me`,
		{ method: "GET" },
		z.array(EnrollmentResponseSchema),
		token,
	);
}

export async function create(
	body: EnrollmentCreateRequest,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}`,
		{ method: "POST", body: JSON.stringify(body) },
		EnrollmentResponseSchema,
		token,
	);
}

export async function accept(
	projectId: string,
	studentId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}/${projectId}/${studentId}/accept`,
		{ method: "PATCH" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function cancel(
	projectId: string,
	studentId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}/${projectId}/${studentId}/cancel`,
		{ method: "PATCH" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function complete(
	projectId: string,
	studentId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}/${projectId}/${studentId}/complete`,
		{ method: "PATCH" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function exit(
	projectId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}/${projectId}/exit`,
		{ method: "PATCH" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function reject(
	projectId: string,
	studentId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}/${projectId}/${studentId}/reject`,
		{ method: "PATCH" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function remove(
	projectId: string,
	studentId: string,
	token?: string,
): Promise<EnrollmentResponse> {
	return zfetch(
		`${BASE}/${projectId}/${studentId}/remove`,
		{ method: "PATCH" },
		EnrollmentResponseSchema,
		token,
	);
}

export async function deleteEnrollment(
	projectId: string,
	studentId: string,
	token?: string,
): Promise<void> {
	return zvoid(
		`${BASE}/${projectId}/${studentId}`,
		{ method: "DELETE" },
		token,
	);
}
