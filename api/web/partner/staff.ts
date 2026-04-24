import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import {
	StaffCreateRequestSchema,
	StaffResponseSchema,
	StaffUpdateRequestSchema,
} from "@/schemas/api";
import type {
	StaffCreateRequest,
	StaffResponse,
	StaffUpdateRequest,
} from "@/types/api";
import { webFetch, webVoid } from "@/utils/web-api";

const BASE = WEB_API_ROUTE_BASES.partner.staff;

export async function get(id: string): Promise<StaffResponse> {
	return webFetch(`${BASE}/${id}`, StaffResponseSchema);
}

export async function getByEmail(email: string): Promise<StaffResponse> {
	return webFetch(`${BASE}/by-email/${email}`, StaffResponseSchema);
}

export async function getMe(): Promise<StaffResponse> {
	return webFetch(`${BASE}/me`, StaffResponseSchema);
}

export async function list(q?: string): Promise<StaffResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${BASE}${search}`, z.array(StaffResponseSchema));
}

export async function listByCpf(cpf: string): Promise<StaffResponse[]> {
	return webFetch(`${BASE}/by-cpf/${cpf}`, z.array(StaffResponseSchema));
}

export async function listByEntity(entityId: string): Promise<StaffResponse[]> {
	return webFetch(
		`${BASE}/by-entity/${entityId}`,
		z.array(StaffResponseSchema),
	);
}

export async function create(body: StaffCreateRequest): Promise<StaffResponse> {
	return webFetch(`${BASE}`, StaffResponseSchema, {
		method: "POST",
		body: JSON.stringify(StaffCreateRequestSchema.parse(body)),
	});
}

export async function update(
	id: string,
	body: StaffUpdateRequest,
): Promise<StaffResponse> {
	return webFetch(`${BASE}/${id}`, StaffResponseSchema, {
		method: "PUT",
		body: JSON.stringify(StaffUpdateRequestSchema.parse(body)),
	});
}

export async function deactivate(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}/deactivate`, { method: "PATCH" });
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}`, { method: "DELETE" });
}
