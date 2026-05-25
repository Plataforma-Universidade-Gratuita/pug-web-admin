import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants";
import { SchoolResponseSchema } from "@/schemas";
import type {
	SchoolCreateRequest,
	SchoolResponse,
	SchoolUpdateRequest,
} from "@/types";
import { zfetch, zvoid, qs } from "@/utils";

export async function get(id: string, token?: string): Promise<SchoolResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.schools}/${id}`,
		{ method: "GET" },
		SchoolResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	q?: string,
): Promise<SchoolResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.academic.schools}${qs({ q })}`,
		{ method: "GET" },
		z.array(SchoolResponseSchema),
		token,
	);
}

export async function create(
	body: SchoolCreateRequest,
	token?: string,
): Promise<SchoolResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.schools}`,
		{ method: "POST", body: JSON.stringify(body) },
		SchoolResponseSchema,
		token,
	);
}

export async function update(
	id: string,
	body: SchoolUpdateRequest,
	token?: string,
): Promise<SchoolResponse> {
	return zfetch(
		`${API_ROUTE_BASES.academic.schools}/${id}`,
		{ method: "PUT", body: JSON.stringify(body) },
		SchoolResponseSchema,
		token,
	);
}

export async function remove(id: string, token?: string): Promise<void> {
	return zvoid(
		`${API_ROUTE_BASES.academic.schools}/${id}`,
		{ method: "DELETE" },
		token,
	);
}
