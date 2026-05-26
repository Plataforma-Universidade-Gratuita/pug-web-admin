import { z } from "zod";

import {
	AdminComplexSearchRequestSchema,
	AdminCreateRequestSchema,
	AdminResponseSchema,
	AdminSearchResponseSchema,
	AdminUpdateRequestSchema,
} from "@/schemas";
import type { PageResponse } from "@/types";

export type AdminResponse = z.infer<typeof AdminResponseSchema>;
export type AdminSearchResponse = z.infer<typeof AdminSearchResponseSchema>;
export type AdminComplexSearchRequest = z.infer<
	typeof AdminComplexSearchRequestSchema
>;
export type AdminCreateRequest = z.infer<typeof AdminCreateRequestSchema>;
export type AdminUpdateRequest = z.infer<typeof AdminUpdateRequestSchema>;
export type AdminComplexSearchResponse = PageResponse<AdminSearchResponse>;
