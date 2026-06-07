import type { TFunction } from "i18next";
import { z } from "zod";

import { CampiEnum } from "@/schemas/api";
import {
	createCpfFieldSchema,
	createEmailFieldSchema,
	createRequiredDateStringSchema,
	createRequiredNumericStringSchema,
	createRequiredTrimmedStringSchema,
	isDateRangeInvalid,
} from "@/schemas/client/shared";
import type { FormerStudentEditorMode } from "@/types/client/features/academic";

export function createFormerStudentEditorFormSchema(
	t: TFunction,
	mode: FormerStudentEditorMode,
) {
	const requiresIdentityFields = mode !== "update";

	return z
		.object({
			cpf: createCpfFieldSchema(
				requiresIdentityFields,
				t("academic.formerStudentPage.editor.validation.cpf.required"),
				t("academic.formerStudentPage.editor.validation.cpf.invalid"),
			),
			name: createRequiredTrimmedStringSchema(
				t("academic.formerStudentPage.editor.validation.name.required"),
				255,
				t("academic.formerStudentPage.editor.validation.name.tooLong"),
			),
			email: createEmailFieldSchema(
				true,
				t("academic.formerStudentPage.editor.validation.email.required"),
				t("academic.formerStudentPage.editor.validation.email.invalid"),
				t("academic.formerStudentPage.editor.validation.email.tooLong"),
			),
			academicRegistration: createRequiredTrimmedStringSchema(
				t(
					"academic.formerStudentPage.editor.validation.academicRegistration.required",
				),
				15,
				t(
					"academic.formerStudentPage.editor.validation.academicRegistration.tooLong",
				),
			),
			campus: CampiEnum,
			courseId: z
				.string()
				.trim()
				.min(
					1,
					t("academic.formerStudentPage.editor.validation.course.required"),
				),
			requiredHours: createRequiredNumericStringSchema(
				t(
					"academic.formerStudentPage.editor.validation.requiredHours.required",
				),
				t("academic.formerStudentPage.editor.validation.requiredHours.invalid"),
				false,
			),
			startDate: createRequiredDateStringSchema(
				t("academic.formerStudentPage.editor.validation.startDate.required"),
			),
			dueDate: createRequiredDateStringSchema(
				t("academic.formerStudentPage.editor.validation.dueDate.required"),
			),
		})
		.superRefine((value, ctx) => {
			if (isDateRangeInvalid(value.startDate, value.dueDate)) {
				ctx.addIssue({
					code: "custom",
					message: t(
						"academic.formerStudentPage.editor.validation.dueDate.range",
					),
					path: ["dueDate"],
				});
			}
		});
}
