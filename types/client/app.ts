/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
