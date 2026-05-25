import { z } from "zod";

import {
	EnrollmentCreateRequestSchema,
	EnrollmentResponseSchema,
	EnrollmentStatusEnum,
	EnrollmentStatusUpdateRequestSchema,
} from "@/schemas";

// ─── Enums ───────────────────────────────────────────────────────────────────

export type EnrollmentStatus = z.infer<typeof EnrollmentStatusEnum>;

// ─── Responses ───────────────────────────────────────────────────────────────

export type EnrollmentResponse = z.infer<typeof EnrollmentResponseSchema>;

// ─── Requests ────────────────────────────────────────────────────────────────

export type EnrollmentCreateRequest = z.infer<
	typeof EnrollmentCreateRequestSchema
>;
export type EnrollmentUpdateRequest = z.infer<
	typeof EnrollmentStatusUpdateRequestSchema
>;
