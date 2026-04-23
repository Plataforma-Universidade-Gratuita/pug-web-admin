import { z } from "zod";

import {
	AdminCreateRequestSchema,
	AdminResponseSchema,
	AdminUpdateRequestSchema,
} from "@/schemas/api";
import { webFetch, webVoid } from "@/utils/web-api";

import type { AdminCreateRequest, AdminResponse, AdminUpdateRequest } from "@/types/api";

const BASE = "/api/identity/admins";

export async function get(id: string): Promise<AdminResponse> {
	return webFetch(`${BASE}/${id}`, AdminResponseSchema);
}

export async function getByEmail(email: string): Promise<AdminResponse> {
	return webFetch(`${BASE}/by-email/${email}`, AdminResponseSchema);
}

export async function getMe(): Promise<AdminResponse> {
	return webFetch(`${BASE}/me`, AdminResponseSchema);
}

export async function list(q?: string): Promise<AdminResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${BASE}${search}`, z.array(AdminResponseSchema));
}

export async function listByCpf(cpf: string): Promise<AdminResponse[]> {
	return webFetch(`${BASE}/by-cpf/${cpf}`, z.array(AdminResponseSchema));
}

export async function create(body: AdminCreateRequest): Promise<AdminResponse> {
	return webFetch(`${BASE}`, AdminResponseSchema, {
		method: "POST",
		body: JSON.stringify(AdminCreateRequestSchema.parse(body)),
	});
}

export async function update(id: string, body: AdminUpdateRequest): Promise<AdminResponse> {
	return webFetch(`${BASE}/${id}`, AdminResponseSchema, {
		method: "PUT",
		body: JSON.stringify(AdminUpdateRequestSchema.parse(body)),
	});
}

export async function deactivate(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}/deactivate`, { method: "PATCH" });
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${BASE}/${id}`, { method: "DELETE" });
}
