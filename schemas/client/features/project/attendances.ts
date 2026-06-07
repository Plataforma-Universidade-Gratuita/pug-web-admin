import type { TFunction } from "i18next";
import { z } from "zod";

import { AttendanceStatusEnum } from "@/schemas/api";
import { createRequiredNumericStringSchema } from "@/schemas/client/shared";
import type { AttendanceEditorMode } from "@/types/client/features/project";

export function createAttendanceEditorFormSchema(
	t: TFunction,
	mode: AttendanceEditorMode,
) {
	return z.object({
		duration:
			mode === "create"
				? createRequiredNumericStringSchema(
						t("project.attendancePage.editor.validation.duration.required"),
						t("project.attendancePage.editor.validation.duration.invalid"),
						false,
					)
				: z.string(),
		projectId:
			mode === "create"
				? z
						.string()
						.trim()
						.min(
							1,
							t("project.attendancePage.editor.validation.project.required"),
						)
				: z.string(),
		formerStudentId:
			mode === "create"
				? z
						.string()
						.trim()
						.min(
							1,
							t("project.attendancePage.editor.validation.student.required"),
						)
				: z.string(),
		status: AttendanceStatusEnum,
	});
}
