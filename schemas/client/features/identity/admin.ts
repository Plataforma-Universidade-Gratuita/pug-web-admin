import type { TFunction } from "i18next";
import { z } from "zod";

import { CampiEnum } from "@/schemas";
import {
	createCpfFieldSchema,
	createEmailFieldSchema,
	createRequiredTrimmedStringSchema,
} from "@/schemas";
import type { AdminEditorMode } from "@/types";

export function createAdminEditorFormSchema(
	t: TFunction,
	mode: AdminEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z.object({
		cpf: createCpfFieldSchema(
			requiresIdentityFields,
			t("identity.adminPage.update.validation.cpf.required"),
			t("identity.adminPage.update.validation.cpf.invalid"),
		),
		name: createRequiredTrimmedStringSchema(
			t("identity.adminPage.update.validation.name"),
			255,
			t("identity.adminPage.update.validation.nameTooLong"),
		),
		email: createEmailFieldSchema(
			true,
			t("identity.adminPage.update.validation.email.required"),
			t("identity.adminPage.update.validation.email.invalid"),
			t("identity.adminPage.update.validation.email.tooLong"),
		),
		campus: CampiEnum,
		password: z.string().trim(),
		active: z.boolean(),
	});
}
