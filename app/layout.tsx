import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { LANG_COOKIE_NAME } from "@/constants/locale";
import { THEME_COOKIE_NAME } from "@/constants/theme";
import { coerceLang } from "@/utils/lang";
import { coerceTheme } from "@/utils/theme-value";

import { Providers } from "./providers";
import { ThemeScript } from "./theme-script";

export const metadata: Metadata = {
	title: {
		default: "PUG Admin",
		template: "%s | PUG Admin",
	},
	description: "Admin interface for the PUG platform.",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const jar = await cookies();
	const initialLangCookieValue = jar.get(LANG_COOKIE_NAME)?.value;
	const initialThemeCookieValue = jar.get(THEME_COOKIE_NAME)?.value;
	const initialLang = coerceLang(initialLangCookieValue);
	const initialTheme = coerceTheme(initialThemeCookieValue);

	return (
		<html
			lang={initialLang}
			className={
				initialTheme === "dark"
					? "dark"
					: initialTheme === "light"
						? "light"
						: undefined
			}
			data-theme={initialTheme !== "system" ? initialTheme : undefined}
			style={{
				colorScheme: initialTheme === "system" ? undefined : initialTheme,
			}}
			suppressHydrationWarning
		>
			<head>
				<ThemeScript />
			</head>
			<body className="surface-1 w-full antialiased">
				<Providers
					initialLangCookieValue={initialLangCookieValue}
					initialThemeCookieValue={initialThemeCookieValue}
				>
					{children}
				</Providers>
			</body>
		</html>
	);
}
