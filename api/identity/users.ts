import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants";
import { UserResponseSchema } from "@/schemas";
import type { UserResponse } from "@/types";
import { zfetch, qs } from "@/utils";

export async function get(id: string, token?: string): Promise<UserResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.users}/${id}`,
		{ method: "GET" },
		UserResponseSchema,
		token,
	);
}

export async function getByCpf(
	cpf: string,
	token?: string,
): Promise<UserResponse> {
	return zfetch(
		`${API_ROUTE_BASES.identity.users}${qs({ cpf })}`,
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
	q?: string,
): Promise<UserResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.identity.users}${qs({ q })}`,
		{ method: "GET" },
		z.array(UserResponseSchema),
		token,
	);
}
