"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { applyClientTheme } from "@/contexts";
import type { AppTheme, ThemeContextValue } from "@/types";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
	children,
	initialMode,
}: {
	children: React.ReactNode;
	initialMode: AppTheme;
}) {
	const [mode, setModeState] = useState<AppTheme>(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("theme-mode");
			if (stored === "light" || stored === "dark" || stored === "system")
				return stored as AppTheme;
		}
		return initialMode;
	});

	const setMode = (next: AppTheme) => {
		setModeState(next);
		if (typeof window !== "undefined") {
			localStorage.setItem("theme-mode", next);
		}
	};

	useEffect(() => {
		applyClientTheme(mode);
	}, [mode]);

	useEffect(() => {
		const handler = (e: StorageEvent) => {
			if (
				e.key === "theme-mode" &&
				(e.newValue === "light" ||
					e.newValue === "dark" ||
					e.newValue === "system")
			) {
				setModeState(e.newValue as AppTheme);
			}
		};
		window.addEventListener("storage", handler);
		return () => window.removeEventListener("storage", handler);
	}, []);

	const value = useMemo<ThemeContextValue>(
		() => ({
			mode,
			setMode,
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
