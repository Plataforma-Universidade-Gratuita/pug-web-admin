import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants/api";
import { AccountResponseSchema } from "@/schemas/api/identity/account";
import type { AccountResponse } from "@/types/api";
import { zfetch, qs } from "@/utils/api";

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

export async function getByEmail(
	email: string,
	token?: string,
): Promise<AccountResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}${qs({ email })}`,
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
	q?: string,
): Promise<AccountResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}${qs({ q })}`,
		{ method: "GET" },
		z.array(AccountResponseSchema),
		token,
	);
}

export async function listByCpf(
	cpf: string,
	token?: string,
): Promise<AccountResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.accounts}${qs({ cpf })}`,
		{ method: "GET" },
		z.array(AccountResponseSchema),
		token,
	);
}
