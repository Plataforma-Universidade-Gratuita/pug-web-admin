import { Home, LogIn } from "lucide-react";

export const NAVBAR_TITLE_ROUTE = "/public";
export const SIDEBAR_STORAGE_KEY = "pug.sidebar";

export const NAVBAR_PRIMARY_ITEMS = [
	{ href: "/", label: "Navbar.paths.home", Icon: Home },
	{ href: "/login", label: "Navbar.paths.login", Icon: LogIn },
] as const;

export const APP_ROUTE_LABELS: Record<string, string> = {
	"/": "Home",
	"/docs": "Docs",
	"/docs/primitives": "Primitives",
	"/docs/routing": "Routing",
	"/docs/routing/previews": "Previews",
	"/docs/routing/previews/error": "Error",
	"/docs/routing/previews/global-error": "Global Error",
	"/docs/routing/previews/not-found": "Not Found",
	"/docs/pages": "Page Patterns",
	"/docs/pages/previews": "Previews",
	"/docs/pages/previews/section-stack": "Section Stack",
	"/docs/pages/previews/operations-workspace": "Operations Workspace",
	"/docs/pages/previews/split-detail": "Split Detail",
};
