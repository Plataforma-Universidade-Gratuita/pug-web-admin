import { z } from "zod";

import {
	AccountComplexSearchResponseSchema,
	AccountResponseSchema,
	EntitySimpleComplexSearchResponseSchema,
} from "@/schemas";

export const StaffResponseSchema = z.object({
	account: AccountResponseSchema,
	entityId: z.string(),
	cityId: z.string(),
});

export const StaffComplexSearchRequestSchema = z.object({
	name: z.string().optional(),
	cpf: z.string().optional(),
	email: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	activeOnly: z.boolean().optional(),
	entityIds: z.array(z.string()).optional(),
});

export const StaffComplexSearchResponseSchema = z.object({
	account: AccountComplexSearchResponseSchema,
	entity: EntitySimpleComplexSearchResponseSchema,
});

export const StaffCreateRequestSchema = z.object({
	cpfString: z.string(),
	name: z.string(),
	emailString: z.string(),
	entityId: z.string(),
});

export const StaffUpdateRequestSchema = z.object({
	name: z.string(),
	emailString: z.string(),
	entityId: z.string(),
});
