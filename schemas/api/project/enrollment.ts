import { z } from "zod";

import { AuditInfoResponseSchema } from "@/schemas/api";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const EnrollmentStatusEnum = z.enum([
	"APPROVED",
	"CANCELED",
	"COMPLETED",
	"EXITED",
	"PENDING",
	"REJECTED",
	"REMOVED",
]);

// ─── Responses ───────────────────────────────────────────────────────────────

export const EnrollmentIdentifierResponseSchema = z.object({
	projectId: z.string(),
	studentId: z.string(),
});

export const EnrollmentInfoResponseSchema = z.object({
	acceptedAt: z.string().nullable(),
	acceptedAtFormatted: z.string(),
	closingStatusAt: z.string().nullable(),
	closingStatusAtFormatted: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const EnrollmentResponseSchema = z.object({
	enrollmentId: EnrollmentIdentifierResponseSchema,
	status: EnrollmentStatusEnum,
	statusFormatted: z.string(),
	enrollmentInfo: EnrollmentInfoResponseSchema,
});

// ─── Requests ────────────────────────────────────────────────────────────────

export const EnrollmentCreateRequestSchema = z.object({
	projectId: z.string(),
});

export const EnrollmentStatusUpdateRequestSchema = z.object({
	status: EnrollmentStatusEnum,
});
