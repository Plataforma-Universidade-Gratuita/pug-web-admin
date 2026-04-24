import type { ReactNode } from "react";

export interface ProvidersProps {
	children: ReactNode;
	initialLangCookieValue: unknown;
	initialThemeCookieValue: unknown;
}
