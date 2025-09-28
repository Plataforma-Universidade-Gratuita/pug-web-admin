"use client";

import { initI18n } from "./i18n";
import { type AppLang } from "./locale";

export function setLang(lang: AppLang) {
	document.cookie = `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
	initI18n(lang).changeLanguage(lang);
	document.documentElement.lang = lang;
}
