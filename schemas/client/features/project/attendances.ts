/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
		enrollmentId:
			mode === "create"
				? z.string().trim().min(1, t("common.validation.enrollment.required"))
				: z.string(),
		projectId: mode === "create" ? z.string() : z.string(),
		formerStudentId: mode === "create" ? z.string() : z.string(),
		status: AttendanceStatusEnum,
	});
}
