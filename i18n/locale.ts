import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANG, LANG_COOKIE_NAME } from "@/constants";
import { I18N_NAMESPACE, LANG_COOKIE_MAX_AGE } from "@/i18n/constants";
import enUSCommon from "@/public/locales/en-US/common.json";
import ptBRCommon from "@/public/locales/pt-BR/common.json";
import type { AppLang } from "@/types/client";

const resources = {
	"en-US": {
		[I18N_NAMESPACE]: enUSCommon,
	},
	"pt-BR": {
		[I18N_NAMESPACE]: ptBRCommon,
	},
} as const;

export function initI18n(initial: AppLang) {
	if (i18n.isInitialized) {
		void i18n.changeLanguage(initial);
		return i18n;
	}

	i18n.use(initReactI18next).init({
		lng: initial,
		fallbackLng: DEFAULT_LANG,
		resources,
		load: "currentOnly",
		ns: [I18N_NAMESPACE],
		defaultNS: I18N_NAMESPACE,
		interpolation: { escapeValue: false },
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
