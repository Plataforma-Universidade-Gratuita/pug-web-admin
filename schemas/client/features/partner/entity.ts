import type { TFunction } from "i18next";
import { z } from "zod";

import type { EntityEditorMode } from "@/types/client/features/partner/entity";

function normalizeCnpj(value: string) {
	return value.replace(/D+/g, "").slice(0, 14);
}

export function createEntityEditorFormSchema(
	t: TFunction,
	mode: EntityEditorMode,
) {
	const requiresIdentityField = mode !== "update";

	return z.object({
		cnpj: requiresIdentityField
			? z
					.string()
					.trim()
					.min(1, t("partner.entityPage.editor.validation.cnpj.required"))
					.refine(
						value => normalizeCnpj(value).length === 14,
						t("partner.entityPage.editor.validation.cnpj.invalid"),
					)
			: z.string(),
		name: z
			.string()
			.trim()
			.min(1, t("partner.entityPage.editor.validation.name")),
		cityId: z
			.string()
			.trim()
			.min(1, t("partner.entityPage.editor.validation.city")),
		address: z.string(),
	});
}
