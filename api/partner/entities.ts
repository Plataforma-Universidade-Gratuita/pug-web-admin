import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants";
import { CityResponseSchema } from "@/schemas";
import { EntityResponseSchema } from "@/schemas";
import type {
	CityResponse,
	EntityCreateRequest,
	EntityResponse,
	EntityUpdateRequest,
} from "@/types";
import { zfetch, zvoid, qs } from "@/utils";

export async function get(id: string, token?: string): Promise<EntityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}/${id}`,
		{ method: "GET" },
		EntityResponseSchema,
		token,
	);
}

export async function getByCnpj(
	cnpj: string,
	token?: string,
): Promise<EntityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}${qs({ cnpj })}`,
		{ method: "GET" },
		EntityResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	q?: string,
	cityId?: string,
): Promise<EntityResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}${qs({ q, cityId })}`,
		{ method: "GET" },
		z.array(EntityResponseSchema),
		token,
	);
}

export async function listCities(token?: string): Promise<CityResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}/cities`,
		{ method: "GET" },
		z.array(CityResponseSchema),
		token,
	);
}

export async function create(
	body: EntityCreateRequest,
	token?: string,
): Promise<EntityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}`,
		{ method: "POST", body: JSON.stringify(body) },
		EntityResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: EntityUpdateRequest,
	token?: string,
): Promise<EntityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.partner.entities}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		EntityResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.partner.entities}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
