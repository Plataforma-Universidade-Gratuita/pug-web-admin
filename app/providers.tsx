"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nextProvider } from "react-i18next";

import { ToastProvider } from "@/components";
import { APP_QUERY_CLIENT_OPTIONS } from "@/constants";
import { LocaleProvider } from "@/contexts/locale";
import { ThemeProvider } from "@/contexts/theme";
import type { ProvidersProps } from "@/types";
import { coerceLang, initI18n } from "@/utils";
import { coerceTheme } from "@/utils";

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
