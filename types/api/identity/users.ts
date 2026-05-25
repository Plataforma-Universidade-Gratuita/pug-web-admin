import { z } from "zod";

import { UserResponseSchema } from "@/schemas";

// ─── Responses ───────────────────────────────────────────────────────────────

export type UserResponse = z.infer<typeof UserResponseSchema>;
