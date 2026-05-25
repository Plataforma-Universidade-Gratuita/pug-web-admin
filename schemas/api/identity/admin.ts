import { z } from "zod";

import { CampiEnum, CampusResponseSchema } from "@/schemas/api";

// ─── Responses ───────────────────────────────────────────────────────────────

export const AdminResponseSchema = z.object({
	accountId: z.string(),
	campus: CampusResponseSchema,
	grantedAt: z.string(),
	grantedAtFormatted: z.string(),
});

// ─── Requests ────────────────────────────────────────────────────────────────

export const AdminCreateRequestSchema = z.object({
	cpf: z.string(),
	name: z.string(),
	email: z.string(),
	campus: CampiEnum,
});

export const AdminUpdateRequestSchema = z.object({
	cpf: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	campus: CampiEnum.nullable().optional(),
});
