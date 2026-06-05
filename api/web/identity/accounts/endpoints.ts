import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import {
	createPageResponseSchema,
	AccountComplexSearchRequestSchema,
	AccountResponseSchema,
	AccountComplexSearchResponseSchema,
} from "@/schemas";
import type {
	AccountComplexSearchRequest,
	AccountComplexSearchResponse,
	AccountResponse,
	PaginationRequest,
} from "@/types";
import { qs, webFetch } from "@/api/web/utils";

export async function get(id: string): Promise<AccountResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}/${id}`,
		AccountResponseSchema,
	);
}

export async function getMe(): Promise<AccountResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}/me`,
		AccountResponseSchema,
	);
}

export async function list(ids?: string[]): Promise<AccountResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}${qs({
			ids: ids?.join(","),
		})}`,
		z.array(AccountResponseSchema),
	);
}

export async function search(
	pagination: PaginationRequest,
	body: AccountComplexSearchRequest,
): Promise<AccountComplexSearchResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}/search${qs({
			page: String(pagination.page),
			size: String(pagination.size),
		})}`,
		createPageResponseSchema(AccountComplexSearchResponseSchema),
		{
			method: "POST",
			body: JSON.stringify(AccountComplexSearchRequestSchema.parse(body)),
		},
	);
}

