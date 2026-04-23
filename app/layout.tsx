import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { Navbar } from "@/components/NavBar";
import type { AppLang, AppTheme } from "@/types/client";
import { THEME_COOKIE_NAME } from "@/constants/theme";
import { coerceLang } from "@/utils/locale";
import { coerceTheme } from "@/utils/theme";

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
	const lang: AppLang = coerceLang(jar.get("lang")?.value);
	const initialTheme: AppTheme = coerceTheme(
		jar.get(THEME_COOKIE_NAME)?.value,
	);

	return (
		<html
			lang={lang}
			data-theme={initialTheme !== "system" ? initialTheme : undefined}
			style={{
				colorScheme:
					initialTheme === "system"
						? undefined
						: initialTheme,
			}}
		>
			<body className="surface-1 w-full antialiased">
				<Providers
					initialLang={lang}
					initialTheme={initialTheme}
				>
					<Navbar>{children}</Navbar>
				</Providers>
			</body>
		</html>
	);
}
