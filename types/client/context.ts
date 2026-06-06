import { SUPPORTED_LANGS } from "@/constants";
import { APP_THEMES } from "@/constants";

export type AppTheme = (typeof APP_THEMES)[number];
export type AppLang = (typeof SUPPORTED_LANGS)[number];

export interface LocaleContextValue {
	lang: AppLang;
	setLang: (lang: AppLang) => void;
}

export interface ThemeContextValue {
	mode: AppTheme;
	setMode: (mode: AppTheme) => void;
}
