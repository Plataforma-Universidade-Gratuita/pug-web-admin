export const supportedLngs = ["pt-BR", "en-US"] as const;
export type AppLang = (typeof supportedLngs)[number];
export const defaultLang: AppLang = "pt-BR";

export function isAppLang(x: unknown): x is AppLang {
	return (
		typeof x === "string" && (supportedLngs as readonly string[]).includes(x)
	);
}

export function coerceLang(x: unknown): AppLang {
	if (isAppLang(x)) return x;
	if (x === "en") return "en-US";
	if (x === "pt") return "pt-BR";
	return defaultLang;
}
