import { Navbar } from "./_components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <Navbar>{children}</Navbar>;
}
