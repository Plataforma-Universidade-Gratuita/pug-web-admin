import { KeyRound, RefreshCcw, ShieldCheck } from "lucide-react";

import type { IconComponent, TranslationKey } from "@/types/client";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";

export const PUBLIC_ROUTES = [LOGIN_ROUTE];

export const LOGIN_SECURITY_HIGHLIGHTS = [
	{
		icon: ShieldCheck,
		titleKey: "auth.login.hero.highlights.adminOnly.title",
		descriptionKey: "auth.login.hero.highlights.adminOnly.description",
	},
	{
		icon: KeyRound,
		titleKey: "auth.login.hero.highlights.session.title",
		descriptionKey: "auth.login.hero.highlights.session.description",
	},
	{
		icon: RefreshCcw,
		titleKey: "auth.login.hero.highlights.refresh.title",
		descriptionKey: "auth.login.hero.highlights.refresh.description",
	},
] as const satisfies readonly {
	icon: IconComponent;
	titleKey: TranslationKey;
	descriptionKey: TranslationKey;
}[];
