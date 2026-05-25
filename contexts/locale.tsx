"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { i18n as I18nInstance } from "i18next";

import type { AppLang, LocaleContextValue } from "@/types";
import { coerceLang } from "@/utils";
import { applyClientLanguage } from "@/utils";

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
	children,
	initialLang,
	i18n,
}: {
	children: React.ReactNode;
	initialLang: AppLang;
	i18n: I18nInstance;
}) {
	const [lang, setLangState] = useState<AppLang>(() => {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("app-lang");
			if (stored) return coerceLang(stored);
		}
		return coerceLang(initialLang);
	});

	const setLang = (next: AppLang) => {
		const canonical = coerceLang(next);
		setLangState(canonical);
		if (typeof window !== "undefined") {
			localStorage.setItem("app-lang", canonical);
		}
	};

	useEffect(() => {
		applyClientLanguage(lang, i18n);
	}, [i18n, lang]);

	useEffect(() => {
		const handler = (e: StorageEvent) => {
			if (e.key === "app-lang" && e.newValue) {
				setLangState(coerceLang(e.newValue));
			}
		};
		window.addEventListener("storage", handler);
		return () => window.removeEventListener("storage", handler);
	}, []);

	const value = useMemo<LocaleContextValue>(
		() => ({
			lang,
			setLang,
		}),
		[lang],
	);

	return (
		<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
	);
}

export function useLocale(): LocaleContextValue {
	const context = useContext(LocaleContext);
	if (!context) {
		throw new Error("useLocale must be used within a LocaleProvider.");
	}
	return context;
}
