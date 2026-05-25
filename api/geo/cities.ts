import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants";
import { CityResponseSchema } from "@/schemas";
import type { CityResponse } from "@/types";
import { zfetch } from "@/utils";

export async function get(id: string, token?: string): Promise<CityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.geo.cities}/${id}`,
		{ method: "GET" },
		CityResponseSchema,
		token,
	);
}

export async function list(token?: string): Promise<CityResponse[]> {
	return zfetch(
		API_ROUTE_BASES.geo.cities,
		{ method: "GET" },
		z.array(CityResponseSchema),
		token,
	);
}
