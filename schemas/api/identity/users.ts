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
	dateFrom: z.iso.datetime({ offset: true }).optional(),
	dateTo: z.iso.datetime({ offset: true }).optional(),
	name: z.string().optional(),
});
