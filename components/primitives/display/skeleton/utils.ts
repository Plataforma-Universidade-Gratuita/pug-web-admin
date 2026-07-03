/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export function normalizeSize(value: string | number | undefined) {
	if (typeof value === "number") {
		return `${value}px`;
	}

	return value;
}
