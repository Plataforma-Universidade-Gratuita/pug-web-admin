// app/layout.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { coerceLang, type AppLang } from "../utils/locale";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/NavBar";

export const metadata: Metadata = { title: "PUG Admin", description: "UG — Admin" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rawLang = (await cookies()).get("lang")?.value;
  const lang: AppLang = coerceLang(rawLang);
  const themeCookie = (await cookies()).get("theme")?.value;

  return (
    <html lang={lang} data-theme={themeCookie && themeCookie !== "system" ? themeCookie : undefined}>
      <body className="surface-1 antialiased">
        <Providers initialLang={lang}>
          <Navbar>{children}</Navbar>
        </Providers>
      </body>
    </html>
  );
}
