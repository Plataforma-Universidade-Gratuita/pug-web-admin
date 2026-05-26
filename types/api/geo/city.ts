import { z } from "zod";

import { CityComplexSearchRequestSchema, CityResponseSchema } from "@/schemas";
import type { PageResponse } from "@/types";

// ─── Responses ───────────────────────────────────────────────────────────────

export type CityResponse = z.infer<typeof CityResponseSchema>;
export type CityComplexSearchRequest = z.infer<
	typeof CityComplexSearchRequestSchema
>;
export type CityComplexSearchResponse = PageResponse<CityResponse>;
