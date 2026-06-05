import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { ThemeScript } from "@/app/theme-script";
import { LANG_COOKIE_NAME, THEME_COOKIE_NAME } from "@/constants";
import type { RootLayoutProps } from "@/types";
import { coerceTheme } from "@/utils/client/theme/theme";
import { coerceLang } from "@/utils/shared/i18n/lang";

export const metadata: Metadata = {
	title: {
		default: "PUG Web Admin",
		template: "%s | PUG Web Admin",
	},
	description: "Operational workspace for the PUG platform.",
	manifest: "/manifest.webmanifest",
	icons: {
		icon: [
			{ url: "/assets/favicon.svg", type: "image/svg+xml" },
			{ url: "/assets/favicon.ico", sizes: "any" },
		],
		apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180" }],
	},
	openGraph: {
		title: "PUG Web Admin",
		description: "Operational workspace for the PUG platform.",
		images: [
			{
				url: "/assets/og-image.png",
				width: 1200,
				height: 630,
				alt: "PUG Web Admin",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "PUG Web Admin",
		description: "Operational workspace for the PUG platform.",
		images: ["/assets/og-image.png"],
	},
};

export default async function RootLayout({ children }: RootLayoutProps) {
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
