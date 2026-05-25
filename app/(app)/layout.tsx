import { Navbar } from "@/features/app-shell";
import type { AppLayoutProps } from "@/types";

export default function AppLayout({ children }: AppLayoutProps) {
	return <Navbar>{children}</Navbar>;
}
