import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import { AccountResponseSchema } from "@/schemas/api";
import type { AccountResponse } from "@/types/api";
import { qs } from "@/utils/api";
import { webFetch } from "@/utils/web-api";

export async function get(id: string): Promise<AccountResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}/${id}`,
		AccountResponseSchema,
	);
}

export async function getByEmail(email: string): Promise<AccountResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}${qs({ email })}`,
		AccountResponseSchema,
	);
}

export async function getMe(): Promise<AccountResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}/me`,
		AccountResponseSchema,
	);
}

export async function list(q?: string): Promise<AccountResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}${search}`,
		z.array(AccountResponseSchema),
	);
}

export async function listByCpf(cpf: string): Promise<AccountResponse[]> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.accounts}${qs({ cpf })}`,
		z.array(AccountResponseSchema),
	);
}
