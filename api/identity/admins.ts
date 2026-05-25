import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants/api";
import { AdminResponseSchema } from "@/schemas/api/identity/admin";
import type {
	AdminCreateRequest,
	AdminResponse,
	AdminUpdateRequest,
} from "@/types/api";
import { zfetch, zvoid, qs } from "@/utils/api";

export async function get(id: string, token?: string): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}/${id}`,
		{ method: "GET" },
		AdminResponseSchema,
		token,
	);
}

export async function getByEmail(
	email: string,
	token?: string,
): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}${qs({ email })}`,
		{ method: "GET" },
		AdminResponseSchema,
		token,
	);
}

export async function getMe(token?: string): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}/me`,
		{ method: "GET" },
		AdminResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	q?: string,
): Promise<AdminResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}${qs({ q })}`,
		{ method: "GET" },
		z.array(AdminResponseSchema),
		token,
	);
}

export async function listByCpf(
	cpf: string,
	token?: string,
): Promise<AdminResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}${qs({ cpf })}`,
		{ method: "GET" },
		z.array(AdminResponseSchema),
		token,
	);
}

export async function create(
	body: AdminCreateRequest,
	token?: string,
): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}`,
		{ method: "POST", body: JSON.stringify(body) },
		AdminResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: AdminUpdateRequest,
	token?: string,
): Promise<AdminResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.admins}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		AdminResponseSchema,
		token,
	);
}

export async function setActive(
	id: string,
	active: boolean,
	token?: string,
): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.identity.admins}/${id}`,
		{ method: "PATCH", body: JSON.stringify({ active }) },
		token,
	);
}

export async function deactivate(id: string, token?: string): Promise<void> {
	return setActive(id, false, token);
}

export async function reactivate(id: string, token?: string): Promise<void> {
	return setActive(id, true, token);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.identity.admins}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
