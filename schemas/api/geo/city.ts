import { z } from "zod";

// ─── Responses ───────────────────────────────────────────────────────────────

export const CityResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	ibgeCode: z.string(),
});

export const CityComplexSearchRequestSchema = z.object({
	name: z.string().trim().min(1).optional(),
});
