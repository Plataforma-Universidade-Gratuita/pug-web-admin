import { z } from "zod";

import {
	EnrollmentCreateRequestSchema,
	EnrollmentResponseSchema,
} from "@/schemas/api";
import type { EnrollmentCreateRequest, EnrollmentResponse } from "@/types/api";
import { webFetch, webVoid } from "@/utils/web-api";

const BASE = "/api/project/enrollments";

export async function get(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${BASE}/${projectId}/${studentId}`,
		EnrollmentResponseSchema,
	);
}

export async function getMine(projectId: string): Promise<EnrollmentResponse> {
	return webFetch(`${BASE}/${projectId}/me`, EnrollmentResponseSchema);
}

export async function list(
	projectId?: string,
	studentId?: string,
): Promise<EnrollmentResponse[]> {
	const params = new URLSearchParams();
	if (projectId) params.set("projectId", projectId);
	if (studentId) params.set("studentId", studentId);
	const search = params.toString();
	return webFetch(
		`${BASE}${search ? `?${search}` : ""}`,
		z.array(EnrollmentResponseSchema),
	);
}

export async function listMine(): Promise<EnrollmentResponse[]> {
	return webFetch(`${BASE}/me`, z.array(EnrollmentResponseSchema));
}

export async function create(
	body: EnrollmentCreateRequest,
): Promise<EnrollmentResponse> {
	return webFetch(`${BASE}`, EnrollmentResponseSchema, {
		method: "POST",
		body: JSON.stringify(EnrollmentCreateRequestSchema.parse(body)),
	});
}

export async function accept(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${BASE}/${projectId}/${studentId}/accept`,
		EnrollmentResponseSchema,
		{ method: "PATCH" },
	);
}

export async function cancel(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${BASE}/${projectId}/${studentId}/cancel`,
		EnrollmentResponseSchema,
		{ method: "PATCH" },
	);
}

export async function complete(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${BASE}/${projectId}/${studentId}/complete`,
		EnrollmentResponseSchema,
		{ method: "PATCH" },
	);
}

export async function exit(projectId: string): Promise<EnrollmentResponse> {
	return webFetch(`${BASE}/${projectId}/exit`, EnrollmentResponseSchema, {
		method: "PATCH",
	});
}

export async function reject(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${BASE}/${projectId}/${studentId}/reject`,
		EnrollmentResponseSchema,
		{ method: "PATCH" },
	);
}

export async function remove(
	projectId: string,
	studentId: string,
): Promise<EnrollmentResponse> {
	return webFetch(
		`${BASE}/${projectId}/${studentId}/remove`,
		EnrollmentResponseSchema,
		{ method: "PATCH" },
	);
}

export async function deleteEnrollment(
	projectId: string,
	studentId: string,
): Promise<void> {
	return webVoid(`${BASE}/${projectId}/${studentId}`, { method: "DELETE" });
}
