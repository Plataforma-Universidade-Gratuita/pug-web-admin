import { z } from "zod";

import {
	AccountComplexSearchResponseSchema,
	AccountResponseSchema,
	CampusResponseSchema,
} from "@/schemas";

// ─── Responses ───────────────────────────────────────────────────────────────

export const AdminResponseSchema = z.object({
	accountResponse: AccountResponseSchema,
	campus: CampusResponseSchema,
	grantedAt: z.string(),
	grantedAtFormatted: z.string(),
});

export const AdminComplexSearchResponseSchema = z.object({
	account: AccountComplexSearchResponseSchema,
	campus: CampusResponseSchema,
	grantedAt: z.string(),
	grantedAtFormatted: z.string(),
});

export const AdminComplexSearchRequestSchema = z.object({
	name: z.string().optional(),
	cpf: z.string().optional(),
	email: z.string().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	activeOnly: z.boolean().optional(),
});

// ─── Requests ────────────────────────────────────────────────────────────────

export const AdminCreateRequestSchema = z.object({
	cpfString: z.string(),
	name: z.string(),
	emailString: z.string(),
	campus: CampusResponseSchema.shape.campus,
});

export const AdminUpdateRequestSchema = z.object({
	name: z.string(),
	emailString: z.string(),
	campus: CampusResponseSchema.shape.campus,
});

export const AdminSearchResponseSchema = AdminComplexSearchResponseSchema;
