import { z } from "zod";

import { AuditInfoResponseSchema, CityResponseSchema } from "@/schemas";

export const EntitySimpleComplexSearchResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const EntityResponseSchema = z.object({
	id: z.string(),
	cnpj: z.string(),
	cnpjFormatted: z.string(),
	name: z.string(),
	address: z.string(),
	cityId: z.string(),
	auditInfo: AuditInfoResponseSchema,
});

export const EntityComplexSearchRequestSchema = z.object({
	name: z.string().optional(),
	cnpj: z.string().optional(),
	address: z.string().optional(),
	cityIds: z.array(z.string()).optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
});

export const EntityComplexSearchResponseSchema = z.object({
	id: z.string(),
	cnpj: z.string(),
	cnpjFormatted: z.string(),
	name: z.string(),
	address: z.string(),
	city: CityResponseSchema,
	auditInfo: AuditInfoResponseSchema,
});

export const EntityCreateRequestSchema = z.object({
	cnpjString: z.string(),
	name: z.string(),
	cityId: z.string(),
	address: z.string(),
});

export const EntityUpdateRequestSchema = z.object({
	name: z.string(),
	cityId: z.string(),
	address: z.string(),
});
