import { z } from "zod";

import { AuditInfoResponseSchema } from "@/schemas";

export const AreaOfExpertiseComplexSearchRequestSchema = z.object({
	name: z.string().optional(),
});

export const AreaOfExpertiseCreateRequestSchema = z.object({
	name: z.string(),
});

export const AreaOfExpertiseUpdateRequestSchema = z.object({
	name: z.string(),
});

export const AreaOfExpertiseResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const AreaOfExpertiseComplexSearchResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});
