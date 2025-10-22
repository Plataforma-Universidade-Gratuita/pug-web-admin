"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AppTheme = "light" | "dark" | "system";
type Ctx = {
	mode: AppTheme;
	resolved: "light" | "dark";
	setMode: (m: AppTheme) => void;
};
const ThemeCtx = createContext<Ctx | null>(null);

function applyTheme(mode: AppTheme) {
	const html = document.documentElement;
	html.classList.add("theme-anim");
	requestAnimationFrame(() => {
		if (mode === "dark") {
			html.classList.add("dark");
			html.setAttribute("data-theme", "dark");
		} else if (mode === "light") {
			html.classList.remove("dark");
			html.setAttribute("data-theme", "light");
		} else {
			html.classList.remove("dark");
			html.removeAttribute("data-theme");
		}
		document.cookie = `theme=${mode}; Path=/; Max-Age=31536000; SameSite=Lax`;
		setTimeout(() => html.classList.remove("theme-anim"), 250);
	});
}

export function ThemeProvider({
	initialMode,
	children,
}: {
	initialMode: AppTheme;
	children: React.ReactNode;
}) {
	const [mode, setMode] = useState<AppTheme>(initialMode);

	const [osDark, setOsDark] = useState(false);
	useEffect(() => {
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = (e: MediaQueryListEvent) => setOsDark(e.matches);
		setOsDark(mql.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	const resolved: "light" | "dark" =
		mode === "system" ? (osDark ? "dark" : "light") : mode;

	useEffect(() => {
		applyTheme(mode);
	}, [mode]);

	return (
		<ThemeCtx.Provider value={{ mode, resolved, setMode }}>
			{children}
		</ThemeCtx.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeCtx);
	if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
	return ctx;
}
