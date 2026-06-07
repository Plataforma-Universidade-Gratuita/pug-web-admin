import { Laptop, Moon, Sun } from "lucide-react";

import type {
	AppShellLanguageOption,
	AppShellThemeOption,
} from "@/types/client";

export const THEME_OPTIONS: readonly AppShellThemeOption[] = [
	{
		value: "light",
		icon: Sun,
		labelKey: "common.selectors.theme.options.light",
	},
	{
		value: "dark",
		icon: Moon,
		labelKey: "common.selectors.theme.options.dark",
	},
	{
		value: "system",
		icon: Laptop,
		labelKey: "common.selectors.theme.options.system",
	},
] as const;

export const LANGUAGE_OPTIONS: readonly AppShellLanguageOption[] = [
	{
		value: "en-US",
		labelKey: "common.selectors.language.options.en-US",
		shortLabelKey: "common.selectors.language.short.en-US",
	},
	{
		value: "pt-BR",
		labelKey: "common.selectors.language.options.pt-BR",
		shortLabelKey: "common.selectors.language.short.pt-BR",
	},
] as const;
