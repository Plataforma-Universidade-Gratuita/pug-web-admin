import { z } from "zod";

import {AuditInfoResponseSchema, EnrollmentIdentifierResponseSchema} from "@/schemas/api";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const AttendanceStatusEnum = z.enum(["ABSENT", "PRESENT", "WAITING"]);

// ─── Responses ───────────────────────────────────────────────────────────────

export const AttendanceStatusResponseSchema = z.object({
    status: AttendanceStatusEnum,
    statusFormatted: z.string(),
});

export const QrValidationInfoResponseSchema = z.object({
    duration: z.number(),
    qrValidationHash: z.string(),
});

export const AttendanceInfoResponseSchema = z.object({
    validatedBy: z.string().nullable(),
    validatedAt: z.string().nullable(),
    validatedAtFormatted: z.string(),
    auditInfo: AuditInfoResponseSchema,
});

export const AttendanceResponseSchema = z.object({
	id: z.string(),
	enrollmentIdentifier: EnrollmentIdentifierResponseSchema,
	qrValidationInfo: QrValidationInfoResponseSchema,
	status: AttendanceStatusResponseSchema,
	attendanceInfo: AttendanceInfoResponseSchema,
});

// ─── Requests ────────────────────────────────────────────────────────────────

export const AttendanceCreateRequestSchema = z.object({
	projectId: z.string(),
	studentId: z.string(),
	duration: z.number(),
});

export const AttendanceValidateRequestSchema = z.object({
	status: AttendanceStatusEnum,
	qrValidationHash: z.string(),
});
