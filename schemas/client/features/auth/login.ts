import type { TFunction } from "i18next";
import { z } from "zod";

export function createLoginFormSchema(t: TFunction) {
	return z.object({
		email: z.email(t("auth.login.validation.email")),
		password: z.string().min(1, t("auth.login.validation.password")),
	});
}
