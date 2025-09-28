import type { Metadata } from "next";
import { cookies } from "next/headers";

import { coerceLang, type AppLang } from "../utils/locale";
import "./globals.css";
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
	const raw = (await cookies()).get("lang")?.value;
	const lang: AppLang = coerceLang(raw);
	return (
		<html lang={lang}>
			<body>
				<Providers initialLang={lang}>{children}</Providers>
			</body>
		</html>
	);
}
