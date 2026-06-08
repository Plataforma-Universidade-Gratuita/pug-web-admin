import type { TFunction } from "i18next";
import { z } from "zod";

import { createRequiredTrimmedStringSchema } from "@/schemas/client/shared";

export function createCourseEditorFormSchema(t: TFunction) {
	return z.object({
		name: createRequiredTrimmedStringSchema(
			t("academic.coursePage.editor.validation.name"),
			150,
			t("academic.coursePage.editor.validation.nameTooLong"),
		),
		areaOfExpertiseId: z
			.string()
			.trim()
			.min(1, t("common.validation.areaOfExpertise.required")),
	});
}
