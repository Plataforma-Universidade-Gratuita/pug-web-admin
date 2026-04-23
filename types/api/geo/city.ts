import { z } from "zod";

import { CityResponseSchema } from "@/schemas/api";

// ─── Responses ───────────────────────────────────────────────────────────────

export type CityResponse = z.infer<typeof CityResponseSchema>;
