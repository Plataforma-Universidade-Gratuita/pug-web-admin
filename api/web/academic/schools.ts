import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
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


export async function get(id: string): Promise<SchoolResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.academic.schools}/${id}`, SchoolResponseSchema);
}

export async function list(q?: string): Promise<SchoolResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${WEB_API_ROUTE_BASES.academic.schools}${search}`, z.array(SchoolResponseSchema));
}

export async function create(
	body: SchoolCreateRequest,
): Promise<SchoolResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.academic.schools}`, SchoolResponseSchema, {
		method: "POST",
		body: JSON.stringify(SchoolCreateRequestSchema.parse(body)),
	});
}

export async function update(
	id: string,
	body: SchoolUpdateRequest,
): Promise<SchoolResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.academic.schools}/${id}`, SchoolResponseSchema, {
		method: "PUT",
		body: JSON.stringify(SchoolUpdateRequestSchema.parse(body)),
	});
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.academic.schools}/${id}`, { method: "DELETE" });
}
