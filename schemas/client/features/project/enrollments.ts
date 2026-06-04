import type { TFunction } from "i18next";
import { z } from "zod";

import {
	createRequiredTrimmedStringSchema,
	EnrollmentStatusEnum,
} from "@/schemas";
import type { EnrollmentEditorMode } from "@/types";

export function createEnrollmentEditorFormSchema(
	t: TFunction,
	mode: EnrollmentEditorMode,
) {
	const statusSchema =
		mode === "create" ? EnrollmentStatusEnum : EnrollmentStatusEnum;

	return z.object({
		projectId: createRequiredTrimmedStringSchema(
			t("project.enrollmentPage.editor.validation.project.required"),
			50,
			t("project.enrollmentPage.editor.validation.project.required"),
		),
		formerStudentId: createRequiredTrimmedStringSchema(
			t("project.enrollmentPage.editor.validation.formerStudent.required"),
			50,
			t("project.enrollmentPage.editor.validation.formerStudent.required"),
		),
		status: statusSchema,
	});
}
