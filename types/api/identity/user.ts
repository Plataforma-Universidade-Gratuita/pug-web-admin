import { z } from "zod";

import { UserResponseSchema } from "@/schemas/api";

// ─── Responses ───────────────────────────────────────────────────────────────

export type UserResponse = z.infer<typeof UserResponseSchema>;
