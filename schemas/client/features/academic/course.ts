import type { TFunction } from "i18next";
import { z } from "zod";

export function createCourseEditorFormSchema(t: TFunction) {
	return z.object({
		name: z
			.string()
			.trim()
			.min(1, t("academic.coursePage.editor.validation.name")),
		schoolId: z
			.string()
			.trim()
			.min(1, t("academic.coursePage.editor.validation.school")),
	});
}
