import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants";
import {
	createPageResponseSchema,
	AccountComplexSearchRequestSchema,
	AccountResponseSchema,
	AccountSearchResponseSchema,
} from "@/schemas";
import type {
	AccountComplexSearchRequest,
	AccountComplexSearchResponse,
	AccountResponse,
	PaginationRequest,
} from "@/types";
import { qs, zfetch } from "@/utils";

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

export async function list(token?: string): Promise<AccountResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}`,
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
		createPageResponseSchema(AccountSearchResponseSchema),
		token,
	);
}
