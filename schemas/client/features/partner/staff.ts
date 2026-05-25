import type { TFunction } from "i18next";
import { z } from "zod";

import type { StaffEditorMode } from "@/types/client/features/partner/staff";

export function createStaffEditorFormSchema(
	t: TFunction,
	mode: StaffEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z.object({
		cpf: requiresIdentityFields
			? z
					.string()
					.trim()
					.min(1, t("partner.staffPage.editor.validation.cpf.required"))
			: z.string(),
		name: z
			.string()
			.trim()
			.min(1, t("partner.staffPage.editor.validation.name.required")),
		email: z
			.string()
			.trim()
			.min(1, t("partner.staffPage.editor.validation.email.required"))
			.email(t("partner.staffPage.editor.validation.email.invalid")),
		entityId: z
			.string()
			.trim()
			.min(1, t("partner.staffPage.editor.validation.entity.required")),
	});
}
