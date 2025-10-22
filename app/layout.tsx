import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { Navbar } from "@/components/NavBar";
import { coerceLang, type AppLang } from "@/utils/locale";

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
	const themeCookie = jar.get("theme")?.value as
		| "light"
		| "dark"
		| "system"
		| undefined;

	const initialTheme = themeCookie ?? "system";

	return (
		<html
			lang={lang}
			className={initialTheme === "dark" ? "dark" : undefined}
			data-theme={initialTheme !== "system" ? initialTheme : undefined}
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
