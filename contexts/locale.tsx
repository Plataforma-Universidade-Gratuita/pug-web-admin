"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { i18n as I18nInstance } from "i18next";
import { useTranslation } from "react-i18next";

import type { AppLang } from "@/utils/locale";

type Ctx = { lang: AppLang; setLang: (l: AppLang) => void };
const C = createContext<Ctx | null>(null);

export function LocaleProvider({
	initialLang,
	i18n,
	children,
}: {
	initialLang: AppLang;
	i18n: I18nInstance;
	children: React.ReactNode;
}) {
	const [lang, setLang] = useState<AppLang>(initialLang);

	useEffect(() => {
		i18n.changeLanguage(lang);
		document.documentElement.lang = lang;
		document.cookie = `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
	}, [lang, i18n]);

	return <C.Provider value={{ lang, setLang }}>{children}</C.Provider>;
}

export function useLocale() {
	const ctx = useContext(C);
	if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
	return ctx;
}
