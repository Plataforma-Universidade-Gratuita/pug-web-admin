import { Laptop, Moon, Sun } from "lucide-react";

import type { AppLang, AppTheme } from "@/types/client";

export const THEME_OPTIONS: Array<{
	value: AppTheme;
	icon: typeof Sun;
}> = [
	{ value: "light", icon: Sun },
	{ value: "dark", icon: Moon },
	{ value: "system", icon: Laptop },
];

export const LANGUAGE_OPTIONS: Array<{
	value: AppLang;
	shortLabelKey: string;
}> = [
	{ value: "en-US", shortLabelKey: "Navbar.controls.language.short.en-US" },
	{ value: "pt-BR", shortLabelKey: "Navbar.controls.language.short.pt-BR" },
];

export function getThemeOptionLabel(value: AppTheme) {
	if (value === "light") {
		return "Navbar.controls.theme.options.light";
	}

	if (value === "dark") {
		return "Navbar.controls.theme.options.dark";
	}

	return "Navbar.controls.theme.options.system";
}

export function getLanguageOptionLabel(value: AppLang) {
	if (value === "pt-BR") {
		return "Navbar.controls.language.options.pt-BR";
	}

	return "Navbar.controls.language.options.en-US";
}
