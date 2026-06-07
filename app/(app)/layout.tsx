import { Navbar } from "@/features";
import type { AppLayoutProps } from "@/types/client";

export default function AppLayout({ children }: AppLayoutProps) {
	return <Navbar>{children}</Navbar>;
}
