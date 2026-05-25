import { APP_THEMES } from "@/constants";

export type AppTheme = (typeof APP_THEMES)[number];

export interface ThemeContextValue {
	mode: AppTheme;
	setMode: (mode: AppTheme) => void;
}
