import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import { CityResponseSchema } from "@/schemas/api";
import type { CityResponse } from "@/types/api";
import { webFetch } from "@/utils/web-api";

const BASE = WEB_API_ROUTE_BASES.geo.cities;

export async function get(id: string): Promise<CityResponse> {
	return webFetch(`${BASE}/${id}`, CityResponseSchema);
}

export async function getByIbge(ibgeCode: string): Promise<CityResponse> {
	return webFetch(`${BASE}/by-ibge/${ibgeCode}`, CityResponseSchema);
}

export async function list(q?: string): Promise<CityResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${BASE}${search}`, z.array(CityResponseSchema));
}
