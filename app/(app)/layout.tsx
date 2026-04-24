import { Navbar } from "../../components/shell/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <Navbar>{children}</Navbar>;
}
