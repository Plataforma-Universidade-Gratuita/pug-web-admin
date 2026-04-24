import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import {
	CourseCreateRequestSchema,
	CourseResponseSchema,
	CourseUpdateRequestSchema,
} from "@/schemas/api";
import type {
	CourseCreateRequest,
	CourseResponse,
	CourseUpdateRequest,
} from "@/types/api";
import { webFetch, webVoid } from "@/utils/web-api";

const BASE = WEB_API_ROUTE_BASES.academic.courses;

export async function get(id: string): Promise<CourseResponse> {
	return webFetch(`${BASE}/${id}`, CourseResponseSchema);
}

export async function list(
	q?: string,
	schoolId?: string,
): Promise<CourseResponse[]> {
	const params = new URLSearchParams();
	if (q) params.set("q", q);
	if (schoolId) params.set("schoolId", schoolId);
	const search = params.toString();
	return webFetch(
		`${BASE}${search ? `?${search}` : ""}`,
		z.array(CourseResponseSchema),
	);
}

export async function create(
	body: CourseCreateRequest,
): Promise<CourseResponse> {
	return webFetch(`${BASE}`, CourseResponseSchema, {
		method: "POST",
		body: JSON.stringify(CourseCreateRequestSchema.parse(body)),
	});
}

export async function update(
	id: string,
	body: CourseUpdateRequest,
): Promise<CourseResponse> {
	return webFetch(`${BASE}/${id}`, CourseResponseSchema, {
		method: "PUT",
		body: JSON.stringify(CourseUpdateRequestSchema.parse(body)),
	});
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}`, { method: "DELETE" });
}
