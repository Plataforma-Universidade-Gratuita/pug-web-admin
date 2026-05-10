import {
	DEFAULT_LANG,
	LANG_ALIASES,
	SUPPORTED_LANGS,
} from "@/constants/locale";
import type { AppLang } from "@/types/client";

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
