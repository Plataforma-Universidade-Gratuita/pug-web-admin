import { z } from "zod";

import { StaffResponseSchema } from "@/schemas/api/partner/staff";
import type {
	StaffCreateRequest,
	StaffResponse,
	StaffUpdateRequest,
} from "@/types/api";
import { zfetch, zvoid, qs } from "@/utils/api";

const BASE = "/partners/staff";

export async function get(id: string, token?: string): Promise<StaffResponse> {
	return zfetch(`${BASE}/${id}`, { method: "GET" }, StaffResponseSchema, token);
}

export async function getByEmail(
	email: string,
	token?: string,
): Promise<StaffResponse> {
	return zfetch(
		`${BASE}/by-email/${email}`,
		{ method: "GET" },
		StaffResponseSchema,
		token,
	);
}

export async function getMe(token?: string): Promise<StaffResponse> {
	return zfetch(`${BASE}/me`, { method: "GET" }, StaffResponseSchema, token);
}

export async function list(
	token?: string,
	q?: string,
): Promise<StaffResponse[]> {
	return zfetch(
		`${BASE}${qs({ q })}`,
		{ method: "GET" },
		z.array(StaffResponseSchema),
		token,
	);
}

export async function listByCpf(
	cpf: string,
	token?: string,
): Promise<StaffResponse[]> {
	return zfetch(
		`${BASE}/by-cpf/${cpf}`,
		{ method: "GET" },
		z.array(StaffResponseSchema),
		token,
	);
}

export async function listByEntity(
	entityId: string,
	token?: string,
): Promise<StaffResponse[]> {
	return zfetch(
		`${BASE}/by-entity/${entityId}`,
		{ method: "GET" },
		z.array(StaffResponseSchema),
		token,
	);
}

export async function create(
	body: StaffCreateRequest,
	token?: string,
): Promise<StaffResponse> {
	return zfetch(
		`${BASE}`,
		{ method: "POST", body: JSON.stringify(body) },
		StaffResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: StaffUpdateRequest,
	token?: string,
): Promise<StaffResponse> {
	return zfetch(
		`${BASE}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		StaffResponseSchema,
		token,
	);
}

export async function deactivate(id: string, token?: string): Promise<void> {
	return zvoid(`${BASE}/${id}/deactivate`, { method: "PATCH" }, token);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(`${BASE}/${id}`, { method: "DELETE" }, token);
}
