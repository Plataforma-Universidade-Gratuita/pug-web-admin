import type { TFunction } from "i18next";
import { z } from "zod";

import { CampiEnum } from "@/schemas/api";
import type { AdminEditorMode } from "@/types/client/features/identity/admin";

export function createAdminEditorFormSchema(
	t: TFunction,
	mode: AdminEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z.object({
		cpf: requiresIdentityFields
			? z
					.string()
					.trim()
					.min(1, t("identity.adminPage.update.validation.cpf.required"))
			: z.string(),
		name: z
			.string()
			.trim()
			.min(1, t("identity.adminPage.update.validation.name")),
		email: z
			.string()
			.trim()
			.min(1, t("identity.adminPage.update.validation.email.required"))
			.email(t("identity.adminPage.update.validation.email.invalid")),
		campus: z
			.string()
			.min(1, t("identity.adminPage.update.validation.campus"))
			.refine(value => CampiEnum.safeParse(value).success, {
				message: t("identity.adminPage.update.validation.campus"),
			}),
	});
}
