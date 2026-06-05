import { DEFAULT_LANG, LANG_ALIASES, SUPPORTED_LANGS } from "@/constants";
import { APP_THEMES } from "@/constants";
import {
	THEME_ANIMATION_CLASS,
	THEME_COOKIE_MAX_AGE,
	THEME_COOKIE_NAME,
} from "@/constants";
import type { AppLang } from "@/types";
import type { AppTheme } from "@/types";

export function isAppLang(x: unknown): x is AppLang {
	return typeof x === "string" && SUPPORTED_LANGS.includes(x as AppLang);
}

export function coerceLang(x: unknown): AppLang {
	if (isAppLang(x)) return x;
	if (typeof x === "string") {
		const alias = LANG_ALIASES[x as keyof typeof LANG_ALIASES];
		if (alias) return alias;
	}
	return DEFAULT_LANG;
}

export function normalizeTextForSearch(value: string) {
	return value
		.normalize("NFD")
		.replace(/\p{Diacritic}+/gu, "")
		.toLocaleLowerCase();
}

export function normalizeDigits(value: string) {
	return value.replace(/\D+/g, "");
}

export function compareNormalizedText(a: string, b: string) {
	return normalizeTextForSearch(a).localeCompare(
		normalizeTextForSearch(b),
		undefined,
		{
			numeric: true,
			sensitivity: "base",
		},
	);
}

export function isAppTheme(x: unknown): x is AppTheme {
	return typeof x === "string" && APP_THEMES.includes(x as AppTheme);
}

export function coerceTheme(x: unknown): AppTheme {
	return isAppTheme(x) ? x : "system";
}

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
		html.classList.remove("light", "dark");
		html.classList.add(resolvedTheme);

		if (mode === "system") {
			html.removeAttribute("data-theme");
		} else {
			html.setAttribute("data-theme", mode);
		}

		html.style.colorScheme = resolvedTheme;
		document.cookie = `${THEME_COOKIE_NAME}=${mode}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;

		setTimeout(() => html.classList.remove(THEME_ANIMATION_CLASS), 250);
	});
}
