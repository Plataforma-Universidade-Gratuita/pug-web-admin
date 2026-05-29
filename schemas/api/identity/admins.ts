import { z } from "zod";

import {
	AccountComplexSearchRequestSchema,
	AccountSearchResponseSchema,
	CampiEnum,
	CampusResponseSchema,
} from "@/schemas";

// ─── Responses ───────────────────────────────────────────────────────────────

export const AdminResponseSchema = z.object({
	accountId: z.string(),
	accountEmail: z.string(),
	accountActive: z.boolean(),
	userId: z.string(),
	userName: z.string(),
	campus: CampusResponseSchema,
	grantedAt: z.string(),
	grantedAtFormatted: z.string(),
});

export const AdminSearchResponseSchema = z.object({
	account: AccountSearchResponseSchema,
	campus: CampusResponseSchema,
	grantedAt: z.string(),
	grantedAtFormatted: z.string(),
});

export const AdminComplexSearchRequestSchema =
	AccountComplexSearchRequestSchema.extend({
		campuses: z.array(CampiEnum),
	});

// ─── Requests ────────────────────────────────────────────────────────────────

export const AdminCreateRequestSchema = z.object({
	cpf: z.string().optional(),
	name: z.string().optional(),
	email: z.string(),
	campus: CampiEnum,
	userId: z.string().optional(),
});

export const AdminUpdateRequestSchema = z.object({
	cpf: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	password: z.string().nullable().optional(),
	campus: CampiEnum.nullable().optional(),
	active: z.boolean().optional(),
});
