import type { TFunction } from "i18next";
import { z } from "zod";

export function createSchoolEditorFormSchema(t: TFunction) {
	return z.object({
		name: z
			.string()
			.trim()
			.min(1, t("academic.schoolPage.editor.validation.name")),
	});
}
