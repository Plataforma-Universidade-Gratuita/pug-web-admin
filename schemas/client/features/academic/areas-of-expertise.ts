/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { TFunction } from "i18next";
import { z } from "zod";

import { createRequiredTrimmedStringSchema } from "@/schemas/client/shared";

export function createAreaOfExpertiseEditorFormSchema(t: TFunction) {
	return z.object({
		name: createRequiredTrimmedStringSchema(
			t("academic.areaOfExpertisePage.editor.validation.name"),
			150,
			t("academic.areaOfExpertisePage.editor.validation.nameTooLong"),
		),
	});
}
