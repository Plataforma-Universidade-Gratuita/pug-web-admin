import type { AppLang } from "../utils/locale";

const loaders: Record<
	AppLang,
	() => Promise<{ default: Record<string, string> }>
> = {
	"pt-BR": () => import("@/public/locales/pt-BR/common.json"),
	"en-US": () => import("@/public/locales/en-US/common.json"),
};

export async function getServerComponentLocale(lng: AppLang) {
	return (await loaders[lng]()).default as Record<string, string>;
}
