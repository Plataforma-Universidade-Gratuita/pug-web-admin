import { z } from "zod";

import { API_ROUTE_BASES } from "@/constants/api";
import { CityResponseSchema } from "@/schemas/api/geo/city";
import type { CityResponse } from "@/types/api";
import { zfetch, qs } from "@/utils/api";


export async function get(id: string, token?: string): Promise<CityResponse> {
	return zfetch(`${API_ROUTE_BASES.geo.cities}/${id}`, { method: "GET" }, CityResponseSchema, token);
}

export async function getByIbge(
	ibgeCode: string,
	token?: string,
): Promise<CityResponse> {
	return zfetch(
		`${API_ROUTE_BASES.geo.cities}/by-ibge/${ibgeCode}`,
		{ method: "GET" },
		CityResponseSchema,
		token,
	);
}

export async function list(
	token?: string,
	q?: string,
): Promise<CityResponse[]> {
	return zfetch(
		`${API_ROUTE_BASES.geo.cities}${qs({ q })}`,
		{ method: "GET" },
		z.array(CityResponseSchema),
		token,
	);
}
