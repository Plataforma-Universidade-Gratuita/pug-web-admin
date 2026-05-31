import type { TFunction } from "i18next";
import { z } from "zod";

import { createRequiredNumericStringSchema } from "@/schemas";

export function createAttendanceFormSchema(t: TFunction) {
	return z.object({
		duration: createRequiredNumericStringSchema(
			t("project.attendancePage.editor.validation.duration.required"),
			t("project.attendancePage.editor.validation.duration.invalid"),
			false,
		),
		projectId: z
			.string()
			.trim()
			.min(1, t("project.attendancePage.editor.validation.project.required")),
		formerStudentId: z
			.string()
			.trim()
			.min(1, t("project.attendancePage.editor.validation.student.required")),
	});
}
