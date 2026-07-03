/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const JSON_HEADERS: Record<string, string> = {
	"Content-Type": "application/json",
};
