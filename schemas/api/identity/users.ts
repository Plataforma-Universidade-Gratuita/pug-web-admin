import { z } from "zod";

import { AuditInfoResponseSchema } from "@/schemas";

export const UserResponseSchema = z.object({
	id: z.string(),
	cpf: z.string(),
	cpfFormatted: z.string(),
	name: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const UserSimpleComplexSearchResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const UserComplexSearchRequestSchema = z.object({
	cpf: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	name: z.string().optional(),
});

export const UserSearchResponseSchema = UserSimpleComplexSearchResponseSchema;
