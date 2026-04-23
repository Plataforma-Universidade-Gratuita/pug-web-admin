"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { AppTheme, ThemeContextValue } from "@/types/client";
import { applyClientTheme } from "@/utils/theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
	children,
	initialMode,
}: {
	children: React.ReactNode;
	initialMode: AppTheme;
}) {
	const [mode, setModeState] = useState<AppTheme>(initialMode);

	useEffect(() => {
		applyClientTheme(mode);
	}, [mode]);

	const value = useMemo<ThemeContextValue>(
		() => ({
			mode,
			setMode: setModeState,
		}),
		[mode],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider.");
	}
	return context;
}
