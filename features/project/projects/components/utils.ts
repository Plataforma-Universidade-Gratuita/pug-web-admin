/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ProjectStatusAction } from "@/types/client";

export function getProjectStatusDialogVariant(action: ProjectStatusAction) {
	switch (action) {
		case "cancel":
			return "danger" as const;
		case "hold":
			return "warning" as const;
		case "complete":
		case "retake":
		case "start":
		default:
			return "success" as const;
	}
}
