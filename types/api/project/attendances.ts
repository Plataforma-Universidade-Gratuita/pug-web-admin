import { z } from "zod";

import {
	AttendanceComplexSearchRequestSchema,
	AttendanceComplexSearchResponseSchema,
	AttendanceCreateRequestSchema,
	AttendanceResponseSchema,
	AttendanceStatusEnum,
	AttendanceValidateRequestSchema,
} from "@/schemas/api";
import type { PageResponse } from "@/types/api";

export type AttendanceStatus = z.infer<typeof AttendanceStatusEnum>;
export type AttendanceResponse = z.infer<typeof AttendanceResponseSchema>;
export type AttendanceComplexSearchRequest = z.infer<
	typeof AttendanceComplexSearchRequestSchema
>;
export type AttendanceComplexSearchResponse = PageResponse<
	z.infer<typeof AttendanceComplexSearchResponseSchema>
>;
export type AttendanceCreateRequest = z.infer<
	typeof AttendanceCreateRequestSchema
>;
export type AttendanceValidateRequest = z.infer<
	typeof AttendanceValidateRequestSchema
>;
