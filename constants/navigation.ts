import { Home, LogIn } from "lucide-react";

export const NAVBAR_TITLE_ROUTE = "/public";
export const SIDEBAR_STORAGE_KEY = "pug.sidebar";

export const NAVBAR_PRIMARY_ITEMS = [
	{ href: "/", label: "Navbar.paths.home", Icon: Home },
	{ href: "/login", label: "Navbar.paths.login", Icon: LogIn },
] as const;
