import {
	AlertTriangle,
	BookOpen,
	BookText,
	BriefcaseBusiness,
	Building2,
	ClipboardCheck,
	ClipboardList,
	FileStack,
	FolderKanban,
	Globe,
	GraduationCap,
	Home,
	LayoutPanelTop,
	MapPinned,
	PanelRight,
	Route,
	SearchX,
	ShieldAlert,
	ShieldUser,
	Shapes,
	SquareMousePointer,
	Users,
	UserRound,
	UserRoundCog,
} from "lucide-react";

import type { MenuGroupChild, MenuLeafItem, RouteLabelMap } from "@/types";

export const NAVBAR_TITLE_ROUTE = "/";

export const SIDEBAR_STORAGE_KEY = "pug.sidebar";

export const SIDEBAR_HOME_ITEM: MenuLeafItem = {
	href: "/",
	label: "Navbar.paths.home",
	Icon: Home,
	exact: true,
};

export const SIDEBAR_NAV_GROUPS: readonly MenuGroupChild[] = [
	{
		label: "Navbar.paths.academic.root",
		Icon: GraduationCap,
		childrenItems: [
			{
				href: "/academic",
				label: "Navbar.paths.academic.root",
				Icon: Home,
				exact: true,
			},
			{
				href: "/academic/course",
				label: "Navbar.paths.academic.course",
				Icon: BookOpen,
			},
			{
				href: "/academic/school",
				label: "Navbar.paths.academic.school",
				Icon: Building2,
			},
			{
				href: "/academic/student",
				label: "Navbar.paths.academic.student",
				Icon: Users,
			},
		],
	},
	{
		label: "Navbar.paths.partner.root",
		Icon: BriefcaseBusiness,
		childrenItems: [
			{
				href: "/partner",
				label: "Navbar.paths.partner.root",
				Icon: Home,
				exact: true,
			},
			{
				href: "/partner/entity",
				label: "Navbar.paths.partner.entity",
				Icon: Building2,
			},
			{
				href: "/partner/staff",
				label: "Navbar.paths.partner.staff",
				Icon: Users,
			},
		],
	},
	{
		label: "Navbar.paths.project.root",
		Icon: FolderKanban,
		childrenItems: [
			{
				href: "/project",
				label: "Navbar.paths.project.root",
				Icon: Home,
				exact: true,
			},
			{
				href: "/project/attendance",
				label: "Navbar.paths.project.attendance",
				Icon: ClipboardCheck,
			},
			{
				href: "/project/enrollment",
				label: "Navbar.paths.project.enrollment",
				Icon: ClipboardList,
			},
			{
				href: "/project/project",
				label: "Navbar.paths.project.project",
				Icon: FolderKanban,
			},
		],
	},
	{
		label: "Navbar.paths.identity.root",
		Icon: ShieldUser,
		childrenItems: [
			{
				href: "/identity",
				label: "Navbar.paths.identity.root",
				Icon: Home,
				exact: true,
			},
			{
				href: "/identity/account",
				label: "Navbar.paths.identity.account",
				Icon: UserRound,
			},
			{
				href: "/identity/admin",
				label: "Navbar.paths.identity.admin",
				Icon: UserRoundCog,
			},
			{
				href: "/identity/user",
				label: "Navbar.paths.identity.user",
				Icon: Users,
			},
		],
	},
	{
		label: "Navbar.paths.geo.root",
		Icon: Globe,
		childrenItems: [
			{
				href: "/geo",
				label: "Navbar.paths.geo.root",
				Icon: Home,
				exact: true,
			},
			{
				href: "/geo/city",
				label: "Navbar.paths.geo.city",
				Icon: MapPinned,
			},
		],
	},
	{
		label: "Navbar.paths.docs.root",
		Icon: BookText,
		childrenItems: [
			{
				href: "/docs",
				label: "Navbar.paths.docs.root",
				Icon: Home,
				exact: true,
			},
			{
				label: "Navbar.paths.docs.primitives.root",
				Icon: Shapes,
				childrenItems: [
					{
						href: "/docs/primitives",
						label: "Navbar.paths.docs.overview",
						Icon: Home,
						exact: true,
					},
					{
						href: "/docs/primitives/actions",
						label: "Navbar.paths.docs.primitives.actions",
						Icon: SquareMousePointer,
					},
					{
						href: "/docs/primitives/display",
						label: "Navbar.paths.docs.primitives.display",
						Icon: LayoutPanelTop,
					},
					{
						href: "/docs/primitives/forms",
						label: "Navbar.paths.docs.primitives.forms",
						Icon: FileStack,
					},
					{
						href: "/docs/primitives/navigation",
						label: "Navbar.paths.docs.primitives.navigation",
						Icon: Route,
					},
					{
						href: "/docs/primitives/overlays",
						label: "Navbar.paths.docs.primitives.overlays",
						Icon: PanelRight,
					},
					{
						href: "/docs/primitives/structure",
						label: "Navbar.paths.docs.primitives.structure",
						Icon: Building2,
					},
				],
			},
			{
				label: "Navbar.paths.docs.routing.root",
				Icon: Route,
				childrenItems: [
					{
						href: "/docs/routing",
						label: "Navbar.paths.docs.overview",
						Icon: Home,
						exact: true,
					},
					{
						href: "/docs/routing/error",
						label: "Navbar.paths.docs.routing.errorPreview",
						Icon: AlertTriangle,
					},
					{
						href: "/docs/routing/global-error",
						label: "Navbar.paths.docs.routing.globalErrorPreview",
						Icon: ShieldAlert,
					},
					{
						href: "/docs/routing/not-found",
						label: "Navbar.paths.docs.routing.notFoundPreview",
						Icon: SearchX,
					},
				],
			},
		],
	},
];

export const APP_ROUTE_LABELS: RouteLabelMap = {
	"/": "Navbar.paths.home",
	"/docs": "Navbar.paths.docs.root",
	"/docs/primitives": "Navbar.paths.docs.primitives.root",
	"/docs/primitives/actions": "Navbar.paths.docs.primitives.actions",
	"/docs/primitives/display": "Navbar.paths.docs.primitives.display",
	"/docs/primitives/forms": "Navbar.paths.docs.primitives.forms",
	"/docs/primitives/navigation": "Navbar.paths.docs.primitives.navigation",
	"/docs/primitives/overlays": "Navbar.paths.docs.primitives.overlays",
	"/docs/primitives/structure": "Navbar.paths.docs.primitives.structure",
	"/docs/routing": "Navbar.paths.docs.routing.root",
	"/docs/routing/error": "Navbar.paths.docs.routing.errorPreview",
	"/docs/routing/global-error": "Navbar.paths.docs.routing.globalErrorPreview",
	"/docs/routing/not-found": "Navbar.paths.docs.routing.notFoundPreview",
	"/academic": "Navbar.paths.academic.root",
	"/academic/course": "Navbar.paths.academic.course",
	"/academic/school": "Navbar.paths.academic.school",
	"/academic/student": "Navbar.paths.academic.student",
	"/geo": "Navbar.paths.geo.root",
	"/geo/city": "Navbar.paths.geo.city",
	"/identity": "Navbar.paths.identity.root",
	"/identity/account": "Navbar.paths.identity.account",
	"/identity/admin": "Navbar.paths.identity.admin",
	"/identity/user": "Navbar.paths.identity.user",
	"/partner": "Navbar.paths.partner.root",
	"/partner/entity": "Navbar.paths.partner.entity",
	"/partner/staff": "Navbar.paths.partner.staff",
	"/project": "Navbar.paths.project.root",
	"/project/attendance": "Navbar.paths.project.attendance",
	"/project/enrollment": "Navbar.paths.project.enrollment",
	"/project/project": "Navbar.paths.project.project",
};
