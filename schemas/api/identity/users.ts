import { z } from "zod";

import { AuditInfoResponseSchema } from "@/schemas";

export const UserResponseSchema = z.object({
	id: z.string(),
	cpf: z.string(),
	cpfFormatted: z.string(),
	name: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const UserSearchResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const UserComplexSearchRequestSchema = z.object({
	name: z.string().trim().min(1).optional(),
	cpf: z.string().trim().min(1).optional(),
	dateFrom: z.string().trim().min(1).optional(),
	dateTo: z.string().trim().min(1).optional(),
});
