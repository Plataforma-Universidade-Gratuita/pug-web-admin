"use client";

import {
	THEME_ANIMATION_CLASS,
	THEME_COOKIE_MAX_AGE,
	THEME_COOKIE_NAME,
} from "@/constants/theme";
import type { AppTheme } from "@/types/client";
import { coerceTheme } from "@/utils/theme-value";

function resolveTheme(mode: AppTheme): Exclude<AppTheme, "system"> {
	if (mode !== "system") return mode;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function applyClientTheme(mode: AppTheme) {
	const html = document.documentElement;
	const current = coerceTheme(html.getAttribute("data-theme"));

	if (current === mode) return;

	const resolvedTheme = resolveTheme(mode);

	html.classList.add(THEME_ANIMATION_CLASS);

	requestAnimationFrame(() => {
		if (mode === "system") {
			html.removeAttribute("data-theme");
		} else {
			html.setAttribute("data-theme", mode);
		}

		html.style.colorScheme = mode === "system" ? "light dark" : resolvedTheme;
		document.cookie = `${THEME_COOKIE_NAME}=${mode}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;

		setTimeout(() => html.classList.remove(THEME_ANIMATION_CLASS), 250);
	});
}
