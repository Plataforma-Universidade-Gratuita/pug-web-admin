import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	AttendanceCreateRequestSchema,
	AttendanceResponseSchema,
	AttendanceValidateRequestSchema,
} from "@/schemas";
import type {
	AttendanceCreateRequest,
	AttendanceResponse,
	AttendanceValidateRequest,
} from "@/types";
import { webFetch, webVoid } from "@/utils";

export async function get(id: string): Promise<AttendanceResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.attendances}/${id}`,
		AttendanceResponseSchema,
	);
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
		`${WEB_API_ROUTE_BASES.project.attendances}${search ? `?${search}` : ""}`,
		z.array(AttendanceResponseSchema),
	);
}

export async function create(
	body: AttendanceCreateRequest,
): Promise<AttendanceResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.attendances}`,
		AttendanceResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(AttendanceCreateRequestSchema.parse(body)),
		},
	);
}

export async function validate(
	id: string,
	body: AttendanceValidateRequest,
): Promise<AttendanceResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.project.attendances}/${id}/validate`,
		AttendanceResponseSchema,
		{
			method: "PATCH",
			body: JSON.stringify(AttendanceValidateRequestSchema.parse(body)),
		},
	);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.project.attendances}/${id}`, {
		method: "DELETE",
	});
}
