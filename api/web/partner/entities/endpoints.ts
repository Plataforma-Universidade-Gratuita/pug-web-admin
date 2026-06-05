import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	EntityComplexSearchRequestSchema,
	EntityComplexSearchResponseSchema,
	EntityCreateRequestSchema,
	EntityResponseSchema,
	EntityUpdateRequestSchema,
	createPageResponseSchema,
} from "@/schemas";
import type {
	EntityComplexSearchRequest,
	EntityComplexSearchResponse,
	EntityCreateRequest,
	EntityResponse,
	EntityUpdateRequest,
	PaginationRequest,
} from "@/types";
import { qs, webFetch, webVoid } from "@/utils";

export { list as listCities } from "@/api/web/geo/cities";

export async function get(id: string): Promise<EntityResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}/${id}`,
		EntityResponseSchema,
	);
}

export async function list(ids?: string[]): Promise<EntityResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}${qs({
			ids: ids?.join(","),
		})}`,
		z.array(EntityResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: EntityComplexSearchRequest,
): Promise<EntityComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.partner.entities}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(EntityComplexSearchResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(EntityComplexSearchRequestSchema.parse(body)),
		},
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
