import { APP_THEMES } from "@/constants";
import type { AppTheme } from "@/types";

export function isAppTheme(x: unknown): x is AppTheme {
	return typeof x === "string" && APP_THEMES.includes(x as AppTheme);
}

export function coerceTheme(x: unknown): AppTheme {
	return isAppTheme(x) ? x : "system";
}
