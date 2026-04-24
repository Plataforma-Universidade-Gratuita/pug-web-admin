import { Navbar } from "@/app/(app)/_components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <Navbar>{children}</Navbar>;
}
