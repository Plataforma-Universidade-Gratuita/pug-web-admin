import { z } from "zod";

import { UserResponseSchema } from "@/schemas/api";
import { webFetch } from "@/utils/web-api";

import type { UserResponse } from "@/types/api";

const BASE = "/api/identity/users";

export async function get(id: string): Promise<UserResponse> {
	return webFetch(`${BASE}/${id}`, UserResponseSchema);
}

export async function getByCpf(cpf: string): Promise<UserResponse> {
	return webFetch(`${BASE}/by-cpf/${cpf}`, UserResponseSchema);
}

export async function getMe(): Promise<UserResponse> {
	return webFetch(`${BASE}/me`, UserResponseSchema);
}

export async function list(q?: string): Promise<UserResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${BASE}${search}`, z.array(UserResponseSchema));
}
