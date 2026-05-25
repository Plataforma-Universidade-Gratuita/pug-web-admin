import type { TFunction } from "i18next";
import { z } from "zod";

import { createRequiredTrimmedStringSchema } from "@/schemas/client/shared";

export function createSchoolEditorFormSchema(t: TFunction) {
	return z.object({
		name: createRequiredTrimmedStringSchema(
			t("academic.schoolPage.editor.validation.name"),
			150,
			t("academic.schoolPage.editor.validation.nameTooLong"),
		),
	});
}
