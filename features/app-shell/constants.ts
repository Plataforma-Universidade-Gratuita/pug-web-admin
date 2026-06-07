import {
	BookOpen,
	BriefcaseBusiness,
	Building2,
	ClipboardCheck,
	ClipboardList,
	FolderKanban,
	Globe,
	GraduationCap,
	Home,
	MapPinned,
	ShieldUser,
	Users,
	UserRound,
	UserRoundCog,
} from "lucide-react";

import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants";
import type {
	MenuGroupChild,
	MenuLeafItem,
	RouteLabelMap,
} from "@/types/client";

export { LANGUAGE_OPTIONS, THEME_OPTIONS };

export const UNKNOWN_ROUTE_LABEL = "Navbar.paths.unknown";

export const NAVBAR_TITLE_ROUTE = "/";

export const SIDEBAR_ROW_BASE_PADDING_REM = 0.725;

export const SIDEBAR_ROW_NEST_STEP_REM = 0.75;

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
				href: "/academic/courses",
				label: "Navbar.paths.academic.course",
				Icon: BookOpen,
			},
			{
				href: "/academic/areas-of-expertise",
				label: "Navbar.paths.academic.school",
				Icon: Building2,
			},
			{
				href: "/academic/former-students",
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
				href: "/partner/entities",
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
				href: "/project/attendances",
				label: "Navbar.paths.project.attendance",
				Icon: ClipboardCheck,
			},
			{
				href: "/project/enrollments",
				label: "Navbar.paths.project.enrollment",
				Icon: ClipboardList,
			},
			{
				href: "/project/projects",
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
				href: "/identity/accounts",
				label: "Navbar.paths.identity.account",
				Icon: UserRound,
			},
			{
				href: "/identity/admins",
				label: "Navbar.paths.identity.admin",
				Icon: UserRoundCog,
			},
			{
				href: "/identity/users",
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
				href: "/geo/cities",
				label: "Navbar.paths.geo.city",
				Icon: MapPinned,
			},
		],
	},
];

export const APP_ROUTE_LABELS: RouteLabelMap = {
	"/": "Navbar.paths.home",
	"/academic": "Navbar.paths.academic.root",
	"/academic/courses": "Navbar.paths.academic.course",
	"/academic/courses/[courseId]": "academic.coursePage.dialog.titleFallback",
	"/academic/areas-of-expertise": "Navbar.paths.academic.school",
	"/academic/areas-of-expertise/[areaOfExpertiseId]":
		"academic.areaOfExpertisePage.dialog.titleFallback",
	"/academic/former-students": "Navbar.paths.academic.student",
	"/academic/former-students/[formerStudentId]":
		"academic.formerStudentPage.dialog.titleFallback",
	"/geo": "Navbar.paths.geo.root",
	"/geo/cities": "Navbar.paths.geo.city",
	"/geo/cities/[cityId]": "geo.cityPage.dialog.titleFallback",
	"/identity": "Navbar.paths.identity.root",
	"/identity/accounts": "Navbar.paths.identity.account",
	"/identity/accounts/[accountId]": "identity.accountPage.dialog.titleFallback",
	"/identity/admins": "Navbar.paths.identity.admin",
	"/identity/admins/[adminId]": "identity.adminPage.dialog.titleFallback",
	"/identity/users": "Navbar.paths.identity.user",
	"/identity/users/[userId]": "identity.userPage.dialog.titleFallback",
	"/partner": "Navbar.paths.partner.root",
	"/partner/entities": "Navbar.paths.partner.entity",
	"/partner/entities/[entityId]": "partner.entityPage.dialog.titleFallback",
	"/partner/staff": "Navbar.paths.partner.staff",
	"/partner/staff/[staffId]": "partner.staffPage.dialog.titleFallback",
	"/project": "Navbar.paths.project.root",
	"/project/attendances": "Navbar.paths.project.attendance",
	"/project/attendances/[attendanceId]":
		"project.attendancePage.dialog.titleFallback",
	"/project/enrollments": "Navbar.paths.project.enrollment",
	"/project/enrollments/[enrollmentId]":
		"project.enrollmentPage.dialog.titleFallback",
	"/project/projects": "Navbar.paths.project.project",
	"/project/projects/[projectId]": "project.projectPage.dialog.titleFallback",
};
