import type { TFunction } from "i18next";
import { z } from "zod";

import { CampiEnum } from "@/schemas/api";
import type { StudentEditorMode } from "@/types/client/features/academic/student";

export function createStudentEditorFormSchema(
	t: TFunction,
	mode: StudentEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z.object({
		cpf: requiresIdentityFields
			? z
					.string()
					.trim()
					.min(1, t("academic.studentPage.editor.validation.cpf.required"))
			: z.string(),
		name: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.name.required")),
		email: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.email.required"))
			.email(t("academic.studentPage.editor.validation.email.invalid")),
		academicRegistration: z
			.string()
			.trim()
			.min(
				1,
				t(
					"academic.studentPage.editor.validation.academicRegistration.required",
				),
			),
		campus: z
			.string()
			.min(1, t("academic.studentPage.editor.validation.campus.required"))
			.refine(value => CampiEnum.safeParse(value).success, {
				message: t("academic.studentPage.editor.validation.campus.required"),
			}),
		courseId: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.course.required")),
		requiredHours: z
			.string()
			.trim()
			.min(
				1,
				t("academic.studentPage.editor.validation.requiredHours.required"),
			)
			.refine(value => !Number.isNaN(Number(value)) && Number(value) > 0, {
				message: t(
					"academic.studentPage.editor.validation.requiredHours.invalid",
				),
			}),
		startDate: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.startDate.required")),
		dueDate: z
			.string()
			.trim()
			.min(1, t("academic.studentPage.editor.validation.dueDate.required")),
	});
}
