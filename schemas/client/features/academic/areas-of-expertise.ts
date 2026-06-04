import type { TFunction } from "i18next";
import { z } from "zod";

import { createRequiredTrimmedStringSchema } from "@/schemas";

export function createAreaOfExpertiseEditorFormSchema(t: TFunction) {
	return z.object({
		name: createRequiredTrimmedStringSchema(
			t("academic.areaOfExpertisePage.editor.validation.name"),
			150,
			t("academic.areaOfExpertisePage.editor.validation.nameTooLong"),
		),
	});
}
