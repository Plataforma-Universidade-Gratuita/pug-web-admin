"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { i18n as I18nInstance } from "i18next";

import type { AppLang, LocaleContextValue } from "@/types/client";
import { applyClientLanguage } from "@/utils/locale";

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
	const [lang, setLangState] = useState<AppLang>(initialLang);

	useEffect(() => {
		applyClientLanguage(lang, i18n);
	}, [i18n, lang]);

	const value = useMemo<LocaleContextValue>(
		() => ({
			lang,
			setLang: setLangState,
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
