import type { Metadata } from "next";
import { cookies } from "next/headers";

import { Navbar } from "@/components/NavBar";
import "@/styles/globals.css";

import { coerceLang, type AppLang } from "../utils/locale";
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
	const rawLang = (await cookies()).get("lang")?.value;
	const lang: AppLang = coerceLang(rawLang);
	const themeCookie = (await cookies()).get("theme")?.value;

	return (
		<html
			lang={lang}
			data-theme={
				themeCookie && themeCookie !== "system" ? themeCookie : undefined
			}
		>
			<body className="surface-1 w-full antialiased">
				<Providers initialLang={lang}>
					<Navbar>{children}</Navbar>
				</Providers>
			</body>
		</html>
	);
}
