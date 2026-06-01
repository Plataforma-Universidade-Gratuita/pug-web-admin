import type { TFunction } from "i18next";
import { z } from "zod";

import { CampiEnum } from "@/schemas";
import {
	createCpfFieldSchema,
	createEmailFieldSchema,
	createRequiredDateStringSchema,
	createRequiredNumericStringSchema,
	createRequiredTrimmedStringSchema,
	isDateRangeInvalid,
} from "@/schemas";
import type { FormerStudentEditorMode } from "@/types";

export function createFormerStudentEditorFormSchema(
	t: TFunction,
	mode: FormerStudentEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z
		.object({
			cpf: createCpfFieldSchema(
				requiresIdentityFields,
				t("academic.studentPage.editor.validation.cpf.required"),
				t("academic.studentPage.editor.validation.cpf.invalid"),
			),
			name: createRequiredTrimmedStringSchema(
				t("academic.studentPage.editor.validation.name.required"),
				255,
				t("academic.studentPage.editor.validation.name.tooLong"),
			),
			email: createEmailFieldSchema(
				true,
				t("academic.studentPage.editor.validation.email.required"),
				t("academic.studentPage.editor.validation.email.invalid"),
				t("academic.studentPage.editor.validation.email.tooLong"),
			),
			academicRegistration: createRequiredTrimmedStringSchema(
				t(
					"academic.studentPage.editor.validation.academicRegistration.required",
				),
				15,
				t(
					"academic.studentPage.editor.validation.academicRegistration.tooLong",
				),
			),
			campus: CampiEnum,
			courseId: z
				.string()
				.trim()
				.min(1, t("academic.studentPage.editor.validation.course.required")),
			requiredHours: createRequiredNumericStringSchema(
				t("academic.studentPage.editor.validation.requiredHours.required"),
				t("academic.studentPage.editor.validation.requiredHours.invalid"),
				false,
			),
			startDate: createRequiredDateStringSchema(
				t("academic.studentPage.editor.validation.startDate.required"),
			),
			dueDate: createRequiredDateStringSchema(
				t("academic.studentPage.editor.validation.dueDate.required"),
			),
		})
		.superRefine((value, ctx) => {
			if (isDateRangeInvalid(value.startDate, value.dueDate)) {
				ctx.addIssue({
					code: "custom",
					message: t("academic.studentPage.editor.validation.dueDate.range"),
					path: ["dueDate"],
				});
			}
		});
}
