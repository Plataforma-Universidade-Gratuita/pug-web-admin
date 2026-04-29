import { z } from "zod";
import type { TFunction } from "i18next";

import {
	TokenResponseSchema,
	createApiSuccessEnvelopeSchema,
} from "@/schemas/api";

export function createLoginFormSchema(t: TFunction) {
	return z.object({
		email: z.email(t("auth.login.validation.email")),
		password: z.string().min(1, t("auth.login.validation.password")),
	});
}

export const RefreshSessionEnvelopeSchema =
	createApiSuccessEnvelopeSchema(TokenResponseSchema);
