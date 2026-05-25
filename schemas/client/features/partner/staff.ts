import type { TFunction } from "i18next";
import { z } from "zod";

import {
	createCpfFieldSchema,
	createEmailFieldSchema,
	createRequiredTrimmedStringSchema,
} from "@/schemas/client/shared";
import type { StaffEditorMode } from "@/types/client/features/partner/staff";

export function createStaffEditorFormSchema(
	t: TFunction,
	mode: StaffEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z.object({
		cpf: createCpfFieldSchema(
			requiresIdentityFields,
			t("partner.staffPage.editor.validation.cpf.required"),
			t("partner.staffPage.editor.validation.cpf.invalid"),
		),
		name: createRequiredTrimmedStringSchema(
			t("partner.staffPage.editor.validation.name.required"),
			255,
			t("partner.staffPage.editor.validation.name.tooLong"),
		),
		email: createEmailFieldSchema(
			true,
			t("partner.staffPage.editor.validation.email.required"),
			t("partner.staffPage.editor.validation.email.invalid"),
			t("partner.staffPage.editor.validation.email.tooLong"),
		),
		entityId: z
			.string()
			.trim()
			.min(1, t("partner.staffPage.editor.validation.entity.required")),
	});
}
