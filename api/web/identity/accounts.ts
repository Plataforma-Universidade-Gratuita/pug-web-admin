import { z } from "zod";

import { AccountResponseSchema } from "@/schemas/api";
import { webFetch } from "@/utils/web-api";

import type { AccountResponse } from "@/types/api";

const BASE = "/api/identity/accounts";

export async function get(id: string): Promise<AccountResponse> {
	return webFetch(`${BASE}/${id}`, AccountResponseSchema);
}

export async function getByEmail(email: string): Promise<AccountResponse> {
	return webFetch(`${BASE}/by-email/${email}`, AccountResponseSchema);
}

export async function getMe(): Promise<AccountResponse> {
	return webFetch(`${BASE}/me`, AccountResponseSchema);
}

export async function list(q?: string): Promise<AccountResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${BASE}${search}`, z.array(AccountResponseSchema));
}

export async function listByCpf(cpf: string): Promise<AccountResponse[]> {
	return webFetch(`${BASE}/by-cpf/${cpf}`, z.array(AccountResponseSchema));
}
