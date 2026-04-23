import { z } from "zod";

import {
	SchoolCreateRequestSchema,
	SchoolResponseSchema,
	SchoolUpdateRequestSchema,
} from "@/schemas/api";
import type {
	SchoolCreateRequest,
	SchoolResponse,
	SchoolUpdateRequest,
} from "@/types/api";
import { webFetch, webVoid } from "@/utils/web-api";

const BASE = "/api/academic/schools";

export async function get(id: string): Promise<SchoolResponse> {
	return webFetch(`${BASE}/${id}`, SchoolResponseSchema);
}

export async function list(q?: string): Promise<SchoolResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${BASE}${search}`, z.array(SchoolResponseSchema));
}

export async function create(
	body: SchoolCreateRequest,
): Promise<SchoolResponse> {
	return webFetch(`${BASE}`, SchoolResponseSchema, {
		method: "POST",
		body: JSON.stringify(SchoolCreateRequestSchema.parse(body)),
	});
}

export async function update(
	id: string,
	body: SchoolUpdateRequest,
): Promise<SchoolResponse> {
	return webFetch(`${BASE}/${id}`, SchoolResponseSchema, {
		method: "PUT",
		body: JSON.stringify(SchoolUpdateRequestSchema.parse(body)),
	});
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}`, { method: "DELETE" });
}
