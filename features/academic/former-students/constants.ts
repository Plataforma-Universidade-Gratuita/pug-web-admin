/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { Campi } from "@/types/api";

export const ADMIN_CAMPI_VALUES = [
	"JARAGUA_DO_SUL",
	"JOINVILLE",
] as const satisfies readonly Campi[];
