/*
 * Exception: the app shell layout imports Navbar directly instead of through
 * the root features barrel because this client boundary must stay explicit for
 * Next.js server build collection.
 */
import { Navbar } from "@/features/app-shell";
import type { AppLayoutProps } from "@/types/client";

export default function AppLayout({ children }: AppLayoutProps) {
	return <Navbar>{children}</Navbar>;
}
