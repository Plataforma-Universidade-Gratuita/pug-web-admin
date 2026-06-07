import type { TFunction } from "i18next";
import { z } from "zod";

import { createPasswordFieldSchema } from "@/schemas/client/shared";

export function createLoginFormSchema(t: TFunction) {
	return z.object({
		email: z.email(t("auth.login.validation.email")),
		password: createPasswordFieldSchema(
			false,
			t("auth.login.validation.passwordRequired"),
			t("auth.login.validation.password"),
		),
	});
}
