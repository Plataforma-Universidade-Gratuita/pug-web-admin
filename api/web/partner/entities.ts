import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import {
	CityResponseSchema,
	EntityCreateRequestSchema,
	EntityResponseSchema,
	EntityUpdateRequestSchema,
} from "@/schemas/api";
import type {
	CityResponse,
	EntityCreateRequest,
	EntityResponse,
	EntityUpdateRequest,
} from "@/types/api";
import { qs } from "@/utils/api";
import { webFetch, webVoid } from "@/utils/web-api";

export async function get(id: string): Promise<EntityResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}/${id}`,
		EntityResponseSchema,
	);
}

export async function getByCnpj(cnpj: string): Promise<EntityResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}${qs({ cnpj })}`,
		EntityResponseSchema,
	);
}

export async function list(
	q?: string,
	cityId?: string,
): Promise<EntityResponse[]> {
	const params = new URLSearchParams();
	if (q) params.set("q", q);
	if (cityId) params.set("cityId", cityId);
	const search = params.toString();
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}${search ? `?${search}` : ""}`,
		z.array(EntityResponseSchema),
	);
}

export async function listCities(): Promise<CityResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}/cities`,
		z.array(CityResponseSchema),
	);
}

export async function create(
	body: EntityCreateRequest,
): Promise<EntityResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}`,
		EntityResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(EntityCreateRequestSchema.parse(body)),
		},
	);
}

export async function update(
	id: string,
	body: EntityUpdateRequest,
): Promise<EntityResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}/${id}`,
		EntityResponseSchema,
		{
			method: "PUT",
			body: JSON.stringify(EntityUpdateRequestSchema.parse(body)),
		},
	);
}

export async function remove(id: string): Promise<void> {
	return webVoid(`${WEB_API_ROUTE_BASES.partner.entities}/${id}`, {
		method: "DELETE",
	});
}
