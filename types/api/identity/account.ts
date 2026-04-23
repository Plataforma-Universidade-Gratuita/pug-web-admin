import { z } from "zod";

import {
  AccountResponseSchema,
} from "@/schemas/api";

// ─── Responses ───────────────────────────────────────────────────────────────

export type AccountResponse = z.infer<typeof AccountResponseSchema>;
