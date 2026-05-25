import type { TFunction } from "i18next";
import { z } from "zod";

import type { ProjectEditorMode } from "@/types/client/features/project/project";

function parsePositiveInteger(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const parsed = Number(trimmed);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		return null;
	}

	return parsed;
}

export function createProjectEditorFormSchema(
	t: TFunction,
	mode: ProjectEditorMode,
) {
	const requiresEntity = mode !== "update";

	return z.object({
		description: z.string(),
		entityId: requiresEntity
			? z
					.string()
					.trim()
					.min(1, t("project.projectPage.editor.validation.entity.required"))
			: z.string(),
		maxParticipants: z
			.string()
			.refine(
				value =>
					value.trim().length === 0 || parsePositiveInteger(value) !== null,
				{
					message: t(
						"project.projectPage.editor.validation.maxParticipants.invalid",
					),
				},
			),
		name: z
			.string()
			.trim()
			.min(1, t("project.projectPage.editor.validation.name.required")),
		offeredHours: z
			.string()
			.trim()
			.min(1, t("project.projectPage.editor.validation.offeredHours.required"))
			.refine(value => parsePositiveInteger(value) !== null, {
				message: t(
					"project.projectPage.editor.validation.offeredHours.invalid",
				),
			}),
	});
}
