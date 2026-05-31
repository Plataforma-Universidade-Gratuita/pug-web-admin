import { z } from "zod";

import {
	AccountTypeEnum,
	AccountTypeResponseSchema,
	AuditInfoResponseSchema,
	UserSimpleComplexSearchResponseSchema,
} from "@/schemas";

export const AccountResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	email: z.string(),
	accountType: AccountTypeResponseSchema,
	auditInfo: AuditInfoResponseSchema,
	active: z.boolean(),
});

export const AccountSimpleComplexSearchResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
});

export const AccountComplexSearchResponseSchema = z.object({
	id: z.string(),
	user: UserSimpleComplexSearchResponseSchema,
	email: z.string(),
	accountType: AccountTypeResponseSchema,
	auditInfo: AuditInfoResponseSchema,
	active: z.boolean(),
});

export const AccountComplexSearchRequestSchema = z.object({
	name: z.string().optional(),
	cpf: z.string().optional(),
	email: z.string().optional(),
	accountTypes: z.array(AccountTypeEnum).optional(),
	dateFrom: z.iso.datetime({ offset: true }).optional(),
	dateTo: z.iso.datetime({ offset: true }).optional(),
	activeOnly: z.boolean().optional(),
});

export const AccountSearchResponseSchema = AccountComplexSearchResponseSchema;
