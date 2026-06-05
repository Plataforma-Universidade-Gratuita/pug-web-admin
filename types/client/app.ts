import type { ReactNode } from "react";

export interface AppLayoutProps {
	children: ReactNode;
}

export interface ProvidersProps {
	children: ReactNode;
	initialLangCookieValue: unknown;
	initialThemeCookieValue: unknown;
}

export interface RootLayoutProps {
	children: ReactNode;
}

export interface NavbarProps {
	children: ReactNode;
}

export interface AppRouteSlugParams {
	slug?: string[];
}

export interface AppRouteSlugContext {
	params: Promise<AppRouteSlugParams>;
}

export interface RouteBoundaryPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}
