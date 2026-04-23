import { z } from "zod";

import { AccountTypeEnum, AuditInfoResponseSchema } from "@/schemas/api";

// ─── Responses ───────────────────────────────────────────────────────────────

export const AccountResponseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	email: z.string(),
	accountType: AccountTypeEnum,
	accountTypeFormatted: z.string(),
	auditInfo: AuditInfoResponseSchema,
	active: z.boolean(),
});
