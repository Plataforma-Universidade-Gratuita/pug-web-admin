import { z } from "zod";

import { AuditInfoResponseSchema } from "@/schemas/api";

export const StaffResponseSchema = z.object({
	accountId: z.string(),
	entityId: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const StaffCreateRequestSchema = z.object({
	cpf: z.string(),
	name: z.string(),
	email: z.string(),
	entityId: z.string(),
});

export const StaffUpdateRequestSchema = z.object({
	cpf: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	entityId: z.string().nullable().optional(),
});
