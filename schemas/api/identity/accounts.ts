import { z } from "zod";

import {
	AccountTypeEnum,
	AuditInfoResponseSchema,
	UserSearchResponseSchema,
} from "@/schemas";

export const AccountResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	email: z.string(),
	accountType: AccountTypeEnum,
	accountTypeFormatted: z.string(),
	auditInfo: AuditInfoResponseSchema,
	active: z.boolean(),
});

export const AccountSearchResponseSchema = z.object({
	id: z.string(),
	user: UserSearchResponseSchema,
	email: z.string(),
	accountType: AccountTypeEnum,
	accountTypeFormatted: z.string(),
	auditInfo: AuditInfoResponseSchema,
	active: z.boolean(),
});

export const AccountComplexSearchRequestSchema = z.object({
	name: z.string().trim().min(1).optional(),
	cpf: z.string().trim().min(1).optional(),
	email: z.string().trim().min(1).optional(),
	accountType: AccountTypeEnum.optional(),
	dateFrom: z.string().trim().min(1).optional(),
	dateTo: z.string().trim().min(1).optional(),
	activeOnly: z.boolean(),
});
