import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import { UserResponseSchema } from "@/schemas";
import type { UserResponse } from "@/types";
import { qs, webFetch } from "@/utils";

export async function get(id: string): Promise<UserResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}/${id}`,
		UserResponseSchema,
	);
}

export async function getByCpf(cpf: string): Promise<UserResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}${qs({ cpf })}`,
		UserResponseSchema,
	);
}

export async function getMe(): Promise<UserResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}/me`,
		UserResponseSchema,
	);
}

export async function list(q?: string): Promise<UserResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(
		`${WEB_API_ROUTE_BASES.identity.users}${search}`,
		z.array(UserResponseSchema),
	);
}
