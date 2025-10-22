"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";

import { LocaleProvider } from "@/contexts/locale";
import { ThemeProvider } from "@/contexts/theme";
import { initI18n } from "@/utils/i18n";

export function Providers({
	children,
	initialLang,
	initialTheme,
}: {
	children: React.ReactNode;
	initialLang: "pt-BR" | "en-US";
	initialTheme: "light" | "dark" | "system";
}) {
	const [qc] = useState(() => new QueryClient());
	const [i18n] = useState(() => initI18n(initialLang));

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
