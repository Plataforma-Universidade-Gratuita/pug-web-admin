import { z } from "zod";

import {
	AuditInfoResponseSchema,
	EntitySimpleComplexSearchResponseSchema,
} from "@/schemas";

export const ProjectStatusEnum = z.enum([
	"CANCELED",
	"COMPLETED",
	"IN_PROGRESS",
	"ON_HOLD",
	"PLANNED",
]);

export const ProjectStatusResponseSchema = z.object({
	status: ProjectStatusEnum,
	statusFormatted: z.string(),
});

export const ProjectSimpleComplexSearchResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const ProjectAreaOfExpertiseRequestSchema = z.object({
	areaOfExpertiseIds: z.array(z.string()),
});

export const ProjectCreateRequestSchema = z.object({
	name: z.string(),
	entityId: z.string(),
	description: z.string(),
	maxParticipants: z.number().nullable(),
	offeredHours: z.number(),
});

export const ProjectUpdateRequestSchema = z.object({
	name: z.string(),
	description: z.string(),
	maxParticipants: z.number().nullable(),
	offeredHours: z.number(),
});

export const ProjectInfoResponseSchema = z.object({
	createdBy: z.string(),
	maxParticipants: z.number().nullable(),
	offeredHours: z.number().nullable(),
	completedHours: z.number().nullable(),
	closedAt: z.string().nullable(),
	closedAtFormatted: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const ProjectResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	entity: EntitySimpleComplexSearchResponseSchema,
	description: z.string(),
	projectInfo: ProjectInfoResponseSchema,
	status: ProjectStatusResponseSchema,
});

export const ProjectComplexSearchRequestSchema = z.object({
	name: z.string().optional(),
	entityIds: z.array(z.string()).optional(),
	description: z.string().optional(),
	createdByIds: z.array(z.string()).optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	statuses: z.array(ProjectStatusEnum).optional(),
	maxOfferedHours: z.number().optional(),
	minOfferedHours: z.number().optional(),
});

export const ProjectComplexSearchResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	entity: EntitySimpleComplexSearchResponseSchema,
	description: z.string(),
	projectInfo: ProjectInfoResponseSchema,
	status: ProjectStatusResponseSchema,
});
