import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import {
	AdminCreateRequestSchema,
	AdminResponseSchema,
	AdminUpdateRequestSchema,
} from "@/schemas/api";
import type {
	AdminCreateRequest,
	AdminResponse,
	AdminUpdateRequest,
} from "@/types/api";
import { qs } from "@/utils/api";
import { webFetch, webVoid } from "@/utils/web-api";


export async function get(id: string): Promise<AdminResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.identity.admins}/${id}`, AdminResponseSchema);
}

export async function getByEmail(email: string): Promise<AdminResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.identity.admins}${qs({ email })}`, AdminResponseSchema);
}

export async function getMe(): Promise<AdminResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.identity.admins}/me`, AdminResponseSchema);
}

export async function list(q?: string): Promise<AdminResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${WEB_API_ROUTE_BASES.identity.admins}${search}`, z.array(AdminResponseSchema));
}

export async function listByCpf(cpf: string): Promise<AdminResponse[]> {
	return webFetch(`${WEB_API_ROUTE_BASES.identity.admins}${qs({ cpf })}`, z.array(AdminResponseSchema));
}

export async function create(body: AdminCreateRequest): Promise<AdminResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.identity.admins}`, AdminResponseSchema, {
		method: "POST",
		body: JSON.stringify(AdminCreateRequestSchema.parse(body)),
	});
}

export async function update(
	id: string,
	body: AdminUpdateRequest,
): Promise<AdminResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.identity.admins}/${id}`, AdminResponseSchema, {
		method: "PUT",
		body: JSON.stringify(AdminUpdateRequestSchema.parse(body)),
	});
}

export async function setActive(id: string, active: boolean): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.identity.admins}/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ active }),
	});
}

export async function deactivate(id: string): Promise<void> {
	return setActive(id, false);
}

export async function reactivate(id: string): Promise<void> {
	return setActive(id, true);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.identity.admins}/${id}`, { method: "DELETE" });
}
