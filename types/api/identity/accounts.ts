import { z } from "zod";

import {
	AccountComplexSearchRequestSchema,
	AccountResponseSchema,
	AccountSearchResponseSchema,
} from "@/schemas";
import type { PageResponse } from "@/types";

export type AccountResponse = z.infer<typeof AccountResponseSchema>;
export type AccountSearchResponse = z.infer<typeof AccountSearchResponseSchema>;
export type AccountComplexSearchRequest = z.infer<
	typeof AccountComplexSearchRequestSchema
>;
export type AccountComplexSearchResponse = PageResponse<AccountSearchResponse>;
