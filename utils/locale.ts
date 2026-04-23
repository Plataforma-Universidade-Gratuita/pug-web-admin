import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import {
	DEFAULT_LANG,
	I18N_LOAD_PATH,
	I18N_NAMESPACE,
	LANG_ALIASES,
	LANG_COOKIE_MAX_AGE,
	LANG_COOKIE_NAME,
	SUPPORTED_LANGS,
} from "@/constants/locale";
import type { AppLang } from "@/types/client";

export function isAppLang(x: unknown): x is AppLang {
	return typeof x === "string" && SUPPORTED_LANGS.includes(x as AppLang);
}

export function coerceLang(x: unknown): AppLang {
	if (isAppLang(x)) return x;
	if (typeof x === "string") {
		const alias = LANG_ALIASES[x as keyof typeof LANG_ALIASES];
		if (alias) return alias;
	}
	return DEFAULT_LANG;
}

export function initI18n(initial: AppLang) {
	if (i18n.isInitialized) return i18n;

	i18n
		.use(HttpBackend)
		.use(initReactI18next)
		.init({
			lng: initial,
			fallbackLng: DEFAULT_LANG,
			supportedLngs: SUPPORTED_LANGS,
			load: "currentOnly",
			ns: [I18N_NAMESPACE],
			defaultNS: I18N_NAMESPACE,
			interpolation: { escapeValue: false },
			backend: { loadPath: I18N_LOAD_PATH },
			initAsync: false,
			react: { useSuspense: false },
		});

	return i18n;
}

export function applyClientLanguage(lang: AppLang, instance = initI18n(lang)) {
	document.cookie = `${LANG_COOKIE_NAME}=${lang}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax`;
	void instance.changeLanguage(lang);
	document.documentElement.lang = lang;
}
