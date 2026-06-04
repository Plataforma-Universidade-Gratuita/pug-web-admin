import type { TFunction } from "i18next";
import { z } from "zod";

import {
	createOptionalNumericStringSchema,
	createOptionalTrimmedStringSchema,
	createRequiredNumericStringSchema,
	createRequiredTrimmedStringSchema,
} from "@/schemas";
import type { ProjectEditorMode } from "@/types";

export function createProjectEditorFormSchema(
	t: TFunction,
	mode: ProjectEditorMode,
) {
	const requiresEntity = mode !== "update";

	return z.object({
		areaOfExpertiseIds: z.array(z.string()),
		description: createOptionalTrimmedStringSchema(
			4000,
			t("project.projectPage.editor.validation.description.tooLong"),
		),
		entityId: requiresEntity
			? z
					.string()
					.trim()
					.min(1, t("project.projectPage.editor.validation.entity.required"))
			: z.string(),
		maxParticipants: createOptionalNumericStringSchema(
			t("project.projectPage.editor.validation.maxParticipants.invalid"),
			true,
		),
		name: createRequiredTrimmedStringSchema(
			t("project.projectPage.editor.validation.name.required"),
			150,
			t("project.projectPage.editor.validation.name.tooLong"),
		),
		offeredHours: createRequiredNumericStringSchema(
			t("project.projectPage.editor.validation.offeredHours.required"),
			t("project.projectPage.editor.validation.offeredHours.invalid"),
			true,
		),
	});
}
