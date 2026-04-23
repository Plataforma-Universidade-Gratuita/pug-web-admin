import { z } from "zod";

import {
	AttendanceCreateRequestSchema,
	AttendanceResponseSchema,
	AttendanceValidateRequestSchema,
} from "@/schemas/api";
import type {
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceValidateRequest,
} from "@/types/api";
import { webFetch, webVoid } from "@/utils/web-api";

const BASE = "/api/project/attendances";

export async function get(id: string): Promise<AttendanceResponse> {
	return webFetch(`${BASE}/${id}`, AttendanceResponseSchema);
}

export async function list(
	projectId?: string,
	studentId?: string,
): Promise<AttendanceResponse[]> {
	const params = new URLSearchParams();
	if (projectId) params.set("projectId", projectId);
	if (studentId) params.set("studentId", studentId);
	const search = params.toString();
	return webFetch(
		`${BASE}${search ? `?${search}` : ""}`,
		z.array(AttendanceResponseSchema),
	);
}

export async function create(
	body: AttendanceCreateRequest,
): Promise<AttendanceResponse> {
	return webFetch(`${BASE}`, AttendanceResponseSchema, {
		method: "POST",
		body: JSON.stringify(AttendanceCreateRequestSchema.parse(body)),
	});
}

export async function validate(
	id: string,
	body: AttendanceValidateRequest,
): Promise<AttendanceResponse> {
	return webFetch(`${BASE}/${id}/validate`, AttendanceResponseSchema, {
		method: "PATCH",
		body: JSON.stringify(AttendanceValidateRequestSchema.parse(body)),
	});
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}`, { method: "DELETE" });
}
