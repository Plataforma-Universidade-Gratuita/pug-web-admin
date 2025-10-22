import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { type AppLang, supportedLngs, defaultLang } from "./locale";

export function initI18n(initial: AppLang) {
	if (i18n.isInitialized) return i18n;

	i18n
		.use(HttpBackend)
		.use(initReactI18next)
		.init({
			lng: initial,
			fallbackLng: defaultLang,
			supportedLngs,
			load: "currentOnly",
			ns: ["common"],
			defaultNS: "common",
			interpolation: { escapeValue: false },
			backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
			initImmediate: false,
			react: { useSuspense: false },
		});

	return i18n;
}
