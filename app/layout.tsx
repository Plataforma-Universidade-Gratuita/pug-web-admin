import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { Navbar } from "@/components/NavBar";
import { LANG_COOKIE_NAME } from "@/constants/locale";
import { THEME_COOKIE_NAME } from "@/constants/theme";
import { coerceLang } from "@/utils/lang";
import { coerceTheme } from "@/utils/theme-value";

import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "PUG Admin",
	description: "UG — Admin",
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
			data-theme={initialTheme !== "system" ? initialTheme : undefined}
			style={{
				colorScheme: initialTheme === "system" ? undefined : initialTheme,
			}}
		>
			<body className="surface-1 w-full antialiased">
				<Providers
					initialLangCookieValue={initialLangCookieValue}
					initialThemeCookieValue={initialThemeCookieValue}
				>
					<Navbar>{children}</Navbar>
				</Providers>
			</body>
		</html>
	);
}
