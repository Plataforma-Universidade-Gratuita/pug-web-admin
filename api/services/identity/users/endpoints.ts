import { z } from "zod";

import { zfetch, qs } from "@/api/utils";
import { API_ROUTE_BASES } from "@/constants";
import {
	createPageResponseSchema,
	UserComplexSearchRequestSchema,
	UserResponseSchema,
} from "@/schemas/api";
import type {
	PaginationRequest,
	UserComplexSearchRequest,
	UserComplexSearchResponse,
	UserResponse,
} from "@/types/api";

export async function get(id: string, token?: string): Promise<UserResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.users}/${id}`,
		{ method: "GET" },
		UserResponseSchema,
		token,
	);
}

export async function getMe(token?: string): Promise<UserResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.users}/me`,
		{ method: "GET" },
		UserResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<UserResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.users}${qs({
			ids: ids?.join(","),
		})}`,
		{ method: "GET" },
		z.array(UserResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: UserComplexSearchRequest,
	token?: string,
): Promise<UserComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.users}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(UserComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(UserResponseSchema),
		token,
	);
}
