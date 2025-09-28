"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "sonner";

import { initI18n } from "../utils/i18n";

export function Providers({
	children,
	initialLang,
}: {
	children: React.ReactNode;
	initialLang: "pt-BR" | "en-US";
}) {
	const qc = new QueryClient();
	const i18n = initI18n(initialLang);
	return (
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={qc}>
				{children}
				<Toaster
					richColors
					position="top-right"
				/>
			</QueryClientProvider>
		</I18nextProvider>
	);
}
