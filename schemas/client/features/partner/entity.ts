import type { TFunction } from "i18next";
import { z } from "zod";

import {
	createCnpjFieldSchema,
	createRequiredTrimmedStringSchema,
} from "@/schemas/client/shared";
import type { EntityEditorMode } from "@/types/client/features/partner/entity";

export function createEntityEditorFormSchema(
	t: TFunction,
	mode: EntityEditorMode,
) {
	const requiresIdentityField = mode !== "update";

	return z.object({
		cnpj: createCnpjFieldSchema(
			requiresIdentityField,
			t("partner.entityPage.editor.validation.cnpj.required"),
			t("partner.entityPage.editor.validation.cnpj.invalid"),
		),
		name: createRequiredTrimmedStringSchema(
			t("partner.entityPage.editor.validation.name"),
			150,
			t("partner.entityPage.editor.validation.nameTooLong"),
		),
		cityId: z
			.string()
			.trim()
			.min(1, t("partner.entityPage.editor.validation.city")),
		address: createRequiredTrimmedStringSchema(
			t("partner.entityPage.editor.validation.address.required"),
			254,
			t("partner.entityPage.editor.validation.address.tooLong"),
		),
	});
}
