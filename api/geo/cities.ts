import { z } from "zod";

import { CityResponseSchema } from "@/schemas/api/geo/city";
import { zfetch, qs } from "@/utils/api";

import type { CityResponse } from "@/types/api";

const BASE = "/geo/cities";

export async function get(id: string, token: string): Promise<CityResponse> {
  return zfetch(`${BASE}/${id}`, { method: "GET" }, CityResponseSchema, token);
}

export async function getByIbge(ibgeCode: string, token: string): Promise<CityResponse> {
  return zfetch(`${BASE}/by-ibge/${ibgeCode}`, { method: "GET" }, CityResponseSchema, token);
}

export async function list(token: string, q?: string): Promise<CityResponse[]> {
  return zfetch(`${BASE}${qs({ q })}`, { method: "GET" }, z.array(CityResponseSchema), token);
}

