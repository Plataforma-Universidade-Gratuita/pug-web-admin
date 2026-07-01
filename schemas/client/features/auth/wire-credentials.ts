import type { TFunction } from "i18next";
import { z } from "zod";

import { doesWireCredentialsPasswordMeetRequirements } from "@/features/app-shell/wire-credentials-utils";
import {
	createEmailFieldSchema,
	createPasswordFieldSchema,
} from "@/schemas/client/shared";

export function createWireCredentialsFormSchema(t: TFunction) {
	return z
		.object({
			email: createEmailFieldSchema(
				true,
				t("auth.login.wireCredentials.validation.email.required"),
				t("auth.login.wireCredentials.validation.email.invalid"),
				t("auth.login.wireCredentials.validation.email.tooLong"),
			),
			password: createPasswordFieldSchema(
				true,
				t("auth.login.wireCredentials.validation.password.required"),
				t("auth.login.wireCredentials.validation.password.invalid"),
			),
			confirmPassword: z.string().trim(),
		})
		.superRefine((value, ctx) => {
			if (
				value.password !== null &&
				!doesWireCredentialsPasswordMeetRequirements(value.password)
			) {
				ctx.addIssue({
					code: "custom",
					path: ["password"],
					message: t("auth.login.wireCredentials.validation.password.invalid"),
				});
			}

			if (value.confirmPassword.trim().length === 0) {
				ctx.addIssue({
					code: "custom",
					path: ["confirmPassword"],
					message: t(
						"auth.login.wireCredentials.validation.confirmPassword.required",
					),
				});
				return;
			}

			if (value.password !== value.confirmPassword) {
				ctx.addIssue({
					code: "custom",
					path: ["confirmPassword"],
					message: t(
						"auth.login.wireCredentials.validation.confirmPassword.match",
					),
				});
			}
		});
}
