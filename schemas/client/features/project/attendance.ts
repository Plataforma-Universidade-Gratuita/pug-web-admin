import type { TFunction } from "i18next";
import { z } from "zod";

function parseDuration(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	const parsed = Number(trimmed);
	if (Number.isNaN(parsed) || parsed <= 0) {
		return null;
	}

	return parsed;
}

export function createAttendanceFormSchema(t: TFunction) {
	return z.object({
		duration: z
			.string()
			.trim()
			.min(1, t("project.attendancePage.editor.validation.duration.required"))
			.refine(value => parseDuration(value) !== null, {
				message: t("project.attendancePage.editor.validation.duration.invalid"),
			}),
		projectId: z
			.string()
			.trim()
			.min(1, t("project.attendancePage.editor.validation.project.required")),
		studentId: z
			.string()
			.trim()
			.min(1, t("project.attendancePage.editor.validation.student.required")),
	});
}
