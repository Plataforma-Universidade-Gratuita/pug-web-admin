import { SUPPORTED_LANGS } from "@/constants";

export type AppLang = (typeof SUPPORTED_LANGS)[number];

export interface LocaleContextValue {
	lang: AppLang;
	setLang: (lang: AppLang) => void;
}
