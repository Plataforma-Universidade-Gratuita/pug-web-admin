import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	createPageResponseSchema,
	UserComplexSearchRequestSchema,
	UserResponseSchema,
} from "@/schemas";
import type {
	PaginationRequest,
	UserComplexSearchRequest,
	UserComplexSearchResponse,
	UserResponse,
} from "@/types";
import { qs, webFetch } from "@/api/web/utils";

export async function get(id: string): Promise<UserResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}/${id}`,
		UserResponseSchema,
	);
}

export async function getMe(): Promise<UserResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}/me`,
		UserResponseSchema,
	);
}

export async function list(ids?: string[]): Promise<UserResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}${qs({
			ids: ids?.join(","),
		})}`,
		z.array(UserResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: UserComplexSearchRequest,
): Promise<UserComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(UserResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(UserComplexSearchRequestSchema.parse(body)),
		},
	);
}

