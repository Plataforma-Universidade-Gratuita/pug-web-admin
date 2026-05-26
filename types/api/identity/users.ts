import { z } from "zod";

import { UserComplexSearchRequestSchema, UserResponseSchema } from "@/schemas";
import type { PageResponse } from "@/types";

// ─── Responses ───────────────────────────────────────────────────────────────

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserComplexSearchRequest = z.infer<
	typeof UserComplexSearchRequestSchema
>;
export type UserComplexSearchResponse = PageResponse<UserResponse>;
