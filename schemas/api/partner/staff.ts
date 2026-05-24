import { z } from "zod";

export const StaffResponseSchema = z.object({
	accountId: z.string(),
	accountEmail: z.string(),
	accountActive: z.boolean(),
	userId: z.string(),
	userName: z.string(),
	entityId: z.string(),
	entityName: z.string(),
	cityId: z.string(),
});

export const StaffCreateRequestSchema = z.object({
	cpf: z.string(),
	name: z.string(),
	email: z.string(),
	password: z.string(),
	entityId: z.string(),
});

export const StaffUpdateRequestSchema = z.object({
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	password: z.string().nullable().optional(),
	active: z.boolean().nullable().optional(),
});
