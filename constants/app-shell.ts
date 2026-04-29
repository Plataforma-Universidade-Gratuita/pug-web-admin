import { Laptop, Moon, Sun } from "lucide-react";

import type {
	AppShellLanguageOption,
	AppShellThemeOption,
} from "@/types/client";

export const UNKNOWN_ROUTE_LABEL = "Navbar.paths.unknown";

export const SIDEBAR_ROW_BASE_PADDING_REM = 0.725;
export const SIDEBAR_ROW_NEST_STEP_REM = 0.75;

export const THEME_OPTIONS: readonly AppShellThemeOption[] = [
	{
		value: "light",
		icon: Sun,
		labelKey: "Navbar.controls.theme.options.light",
	},
	{
		value: "dark",
		icon: Moon,
		labelKey: "Navbar.controls.theme.options.dark",
	},
	{
		value: "system",
		icon: Laptop,
		labelKey: "Navbar.controls.theme.options.system",
	},
] as const;

export const LANGUAGE_OPTIONS: readonly AppShellLanguageOption[] = [
	{
		value: "en-US",
		labelKey: "Navbar.controls.language.options.en-US",
		shortLabelKey: "Navbar.controls.language.short.en-US",
	},
	{
		value: "pt-BR",
		labelKey: "Navbar.controls.language.options.pt-BR",
		shortLabelKey: "Navbar.controls.language.short.pt-BR",
	},
] as const;
