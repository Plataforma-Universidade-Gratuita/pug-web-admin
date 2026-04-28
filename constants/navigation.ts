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
	"/docs/primitives/actions": "Actions",
	"/docs/primitives/display": "Display",
	"/docs/primitives/forms": "Forms",
	"/docs/primitives/navigation": "Navigation",
	"/docs/primitives/overlays": "Overlays",
	"/docs/primitives/structure": "Structure",
	"/docs/primitives/page": "Primitives Home",
	"/docs/routing": "Routing",
	"/docs/routing/previews": "Previews",
	"/docs/pages": "Page Patterns",
	"/docs/pages/section-stack": "Section Stack",
	"/docs/pages/operations-workspace": "Operations Workspace",
	"/docs/pages/split-detail": "Split Detail",
	"/academic": "Academic",
	"/academic/course": "Courses",
	"/academic/school": "Schools",
	"/academic/student": "Students",
	"/geo": "Geo",
	"/geo/city": "Cities",
	"/identity": "Identity",
	"/identity/account": "Accounts",
	"/identity/admin": "Admins",
	"/identity/user": "Users",
	"/partner": "Partner",
	"/partner/entity": "Entities",
	"/partner/staff": "Staff",
	"/project": "Project",
	"/project/attendance": "Attendance",
	"/project/enrollment": "Enrollment",
	"/project/project": "Projects",
};
