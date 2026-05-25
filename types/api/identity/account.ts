import { z } from "zod";

import { AccountResponseSchema } from "@/schemas";

// ─── Responses ───────────────────────────────────────────────────────────────

export type AccountResponse = z.infer<typeof AccountResponseSchema>;
