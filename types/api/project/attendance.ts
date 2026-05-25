import { z } from "zod";

import {
	AttendanceCreateRequestSchema,
	AttendanceResponseSchema,
	AttendanceStatusEnum,
	AttendanceValidateRequestSchema,
} from "@/schemas";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type AttendanceStatus = z.infer<typeof AttendanceStatusEnum>;

// ─── Responses ───────────────────────────────────────────────────────────────

export type AttendanceResponse = z.infer<typeof AttendanceResponseSchema>;

// ─── Requests ────────────────────────────────────────────────────────────────

export type AttendanceCreateRequest = z.infer<
	typeof AttendanceCreateRequestSchema
>;
export type AttendanceValidateRequest = z.infer<
	typeof AttendanceValidateRequestSchema
>;
