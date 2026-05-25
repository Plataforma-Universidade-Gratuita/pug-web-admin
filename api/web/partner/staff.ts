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
import { qs } from "@/utils/api";
import { webFetch, webVoid } from "@/utils/web-api";

export async function get(id: string): Promise<StaffResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.staff}/${id}`,
		StaffResponseSchema,
	);
}

export async function getByEmail(email: string): Promise<StaffResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.staff}${qs({ email })}`,
		StaffResponseSchema,
	);
}

export async function getMe(): Promise<StaffResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.staff}/me`,
		StaffResponseSchema,
	);
}

export async function list(q?: string): Promise<StaffResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.staff}${search}`,
		z.array(StaffResponseSchema),
	);
}

export async function listByCpf(cpf: string): Promise<StaffResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.staff}${qs({ cpf })}`,
		z.array(StaffResponseSchema),
	);
}

export async function listByEntity(entityId: string): Promise<StaffResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.staff}${qs({ entityId })}`,
		z.array(StaffResponseSchema),
	);
}

export async function create(body: StaffCreateRequest): Promise<StaffResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.partner.staff}`, StaffResponseSchema, {
		method: "POST",
		body: JSON.stringify(StaffCreateRequestSchema.parse(body)),
	});
}

export async function update(
	id: string,
	body: StaffUpdateRequest,
): Promise<StaffResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.staff}/${id}`,
		StaffResponseSchema,
		{
			method: "PUT",
			body: JSON.stringify(StaffUpdateRequestSchema.parse(body)),
		},
	);
}

export async function setActive(id: string, active: boolean): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.partner.staff}/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ active }),
	});
}

export async function deactivate(id: string): Promise<void> {
	return setActive(id, false);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.partner.staff}/${id}`, {
		method: "DELETE",
	});
}
