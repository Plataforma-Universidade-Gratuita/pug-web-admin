import { z } from "zod";

import { AuditInfoResponseSchema } from "@/schemas";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const ProjectStatusEnum = z.enum([
	"CANCELED",
	"COMPLETED",
	"IN_PROGRESS",
	"ON_HOLD",
	"PLANNED",
]);

// ─── Responses ───────────────────────────────────────────────────────────────

export const ProjectStatusResponseSchema = z.object({
	status: ProjectStatusEnum,
	statusFormatted: z.string(),
});

export const ProjectInfoResponseSchema = z.object({
	createdBy: z.string(),
	maxParticipants: z.number().nullable(),
	offeredHours: z.number(),
	completedHours: z.number(),
	closedAt: z.string().nullable(),
	closedAtFormatted: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const ProjectResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	entityId: z.string(),
	description: z.string(),
	status: ProjectStatusResponseSchema,
	projectInfo: ProjectInfoResponseSchema,
});

// ─── Requests ────────────────────────────────────────────────────────────────

export const ProjectCreateRequestSchema = z.object({
	name: z.string(),
	entityId: z.string(),
	description: z.string().nullable().optional(),
	maxParticipants: z.number().nullable().optional(),
	offeredHours: z.number(),
});

export const ProjectUpdateRequestSchema = z.object({
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	maxParticipants: z.number().nullable().optional(),
	offeredHours: z.number().nullable().optional(),
});

export const ProjectStatusUpdateRequestSchema = z.object({
	status: ProjectStatusEnum,
});

export const ProjectSchoolRequestSchema = z.object({
	projectId: z.string(),
	schoolIds: z.array(z.string()),
});

export const ProjectSchoolAssociationUpdateRequestSchema = z.object({
	schoolIds: z.array(z.string()),
});
