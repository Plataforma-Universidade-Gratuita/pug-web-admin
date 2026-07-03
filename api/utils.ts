/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export function qs(
	params: Record<string, string | string[] | undefined | null>,
): string {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value == null) {
			continue;
		}

		if (Array.isArray(value)) {
			for (const item of value) {
				if (item !== "") {
					searchParams.append(key, item);
				}
			}
			continue;
		}

		if (value !== "") {
			searchParams.append(key, value);
		}
	}

	const query = searchParams.toString();
	return query ? `?${query}` : "";
}

export { ApiError, zfetch, zvoid } from "./services/utils";
