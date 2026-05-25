import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants/api";
import { CityResponseSchema } from "@/schemas/api";
import type { CityResponse } from "@/types/api";
import { webFetch } from "@/utils/web-api";


export async function get(id: string): Promise<CityResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.geo.cities}/${id}`, CityResponseSchema);
}

export async function getByIbge(ibgeCode: string): Promise<CityResponse> {
	return webFetch(`${WEB_API_ROUTE_BASES.geo.cities}/by-ibge/${ibgeCode}`, CityResponseSchema);
}

export async function list(q?: string): Promise<CityResponse[]> {
	const search = q ? `?${new URLSearchParams({ q }).toString()}` : "";
	return webFetch(`${WEB_API_ROUTE_BASES.geo.cities}${search}`, z.array(CityResponseSchema));
}
