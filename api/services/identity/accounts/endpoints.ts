import { z } from "zod";

import { API_ROUTE_BASES } from "@/api/services/constants";
import { qs, zfetch } from "@/api/utils";
import {
	AccountComplexSearchResponseSchema,
	createPageResponseSchema,
	AccountComplexSearchRequestSchema,
	AccountResponseSchema,
} from "@/schemas/api";
import type {
	AccountComplexSearchRequest,
	AccountComplexSearchResponse,
	AccountResponse,
	PaginationRequest,
} from "@/types/api";

export async function get(
	id: string,
	token?: string,
): Promise<AccountResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}/${id}`,
		{ method: "GET" },
		AccountResponseSchema,
		token,
	);
}

export async function getMe(token?: string): Promise<AccountResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}/me`,
		{ method: "GET" },
		AccountResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	ids?: string[],
): Promise<AccountResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}${qs({
			ids,
		})}`,
		{ method: "GET" },
		z.array(AccountResponseSchema),
		token,
	);
}

export async function search(
	pagination: PaginationRequest,
	body: AccountComplexSearchRequest,
	token?: string,
): Promise<AccountComplexSearchResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		{
			method: "POST",
			body: JSON.stringify(AccountComplexSearchRequestSchema.parse(body)),
		},
		createPageResponseSchema(AccountComplexSearchResponseSchema),
		token,
	);
}
