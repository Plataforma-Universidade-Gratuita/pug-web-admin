/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ServicePageSizeOption } from "@/types/client";

export const SERVICE_PAGE_SIZE_OPTIONS: readonly ServicePageSizeOption[] = [
	25,
	50,
	100,
	"all",
] as const;
