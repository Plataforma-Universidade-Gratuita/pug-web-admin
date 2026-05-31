import { z } from "zod";

import {
	UserComplexSearchRequestSchema,
	UserResponseSchema,
	UserSimpleComplexSearchResponseSchema,
	UserSearchResponseSchema,
} from "@/schemas";
import type { PageResponse } from "@/types";

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserSimpleComplexSearchResponse = z.infer<
	typeof UserSimpleComplexSearchResponseSchema
>;
export type UserSearchResponse = z.infer<typeof UserSearchResponseSchema>;
export type UserComplexSearchRequest = z.infer<
	typeof UserComplexSearchRequestSchema
>;
export type UserComplexSearchResponse = PageResponse<UserResponse>;
