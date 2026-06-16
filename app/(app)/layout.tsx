/*
 * Exception: the app shell layout imports Navbar directly instead of through
 * the root features barrel because this client boundary must stay explicit for
 * Next.js server build collection.
 */
import { cookies } from "next/headers";

import { PASSWORD_WIRED_COOKIE } from "@/constants";
import { Navbar } from "@/features/app-shell";
import type { AppLayoutProps } from "@/types/client";

export default async function AppLayout({ children }: AppLayoutProps) {
	const jar = await cookies();
	const passwordWired = jar.get(PASSWORD_WIRED_COOKIE)?.value !== "false";

	return <Navbar>{passwordWired ? children : null}</Navbar>;
}
