"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nextProvider } from "react-i18next";

import { APP_QUERY_CLIENT_OPTIONS } from "@/app/constants";
import { ToastProvider } from "@/components/primitives";
import { LocaleProvider, ThemeProvider, coerceTheme } from "@/contexts";
import { initI18n } from "@/i18n";
import type { ProvidersProps } from "@/types/client";
import { coerceLang } from "@/utils";

export function Providers({
	children,
	initialLangCookieValue,
	initialThemeCookieValue,
}: ProvidersProps) {
	const initialLang = coerceLang(initialLangCookieValue);
	const [qc] = useState(() => new QueryClient(APP_QUERY_CLIENT_OPTIONS));
	const [i18n] = useState(() => initI18n(initialLang));
	const initialTheme = coerceTheme(initialThemeCookieValue);

	return (
		<I18nextProvider i18n={i18n}>
			<ThemeProvider initialMode={initialTheme}>
				<LocaleProvider
					initialLang={initialLang}
					i18n={i18n}
				>
					<QueryClientProvider client={qc}>
						{children}
						<ToastProvider />
						{process.env.NODE_ENV === "development" ? (
							<ReactQueryDevtools initialIsOpen={false} />
						) : null}
					</QueryClientProvider>
				</LocaleProvider>
			</ThemeProvider>
		</I18nextProvider>
	);
}
