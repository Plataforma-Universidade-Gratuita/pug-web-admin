/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export function subscribeToSystemTheme(callback: () => void) {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", callback);
	return () => mediaQuery.removeEventListener("change", callback);
}

export function getSystemThemeSnapshot() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
