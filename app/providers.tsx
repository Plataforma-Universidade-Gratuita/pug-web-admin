"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";

import { LocaleProvider } from "@/contexts/locale";
import { ThemeProvider } from "@/contexts/theme";
import { coerceLang } from "@/utils/lang";
import { initI18n } from "@/utils/locale";
import { coerceTheme } from "@/utils/theme-value";

export interface ProvidersProps {
	children: React.ReactNode;
	initialLangCookieValue: unknown;
	initialThemeCookieValue: unknown;
}

export function Providers({
	children,
	initialLangCookieValue,
	initialThemeCookieValue,
}: ProvidersProps) {
	const initialLang = coerceLang(initialLangCookieValue);
	const [qc] = useState(() => new QueryClient());
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
						<Toaster
							richColors
							position="top-right"
						/>
					</QueryClientProvider>
				</LocaleProvider>
			</ThemeProvider>
		</I18nextProvider>
	);
}
