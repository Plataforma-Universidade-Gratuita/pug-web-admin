import { z } from "zod";

import { WEB_API_ROUTE_BASES } from "@/constants";
import { CityResponseSchema } from "@/schemas";
import type { CityResponse } from "@/types";
import { webFetch } from "@/utils";

export async function get(id: string): Promise<CityResponse> {
	return webFetch(
		`${WEB_API_ROUTE_BASES.geo.cities}/${id}`,
		CityResponseSchema,
	);
}

export async function list(): Promise<CityResponse[]> {
	return webFetch(WEB_API_ROUTE_BASES.geo.cities, z.array(CityResponseSchema));
}
