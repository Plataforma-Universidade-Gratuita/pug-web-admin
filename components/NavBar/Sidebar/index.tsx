"use client";

import { usePathname } from "next/navigation";

import {
	Home,
	Loader,
	MessageCircleX,
	Ban,
	CircleHelp as CircleQuestionMark,
	Globe,
	FileText,
	SwatchBook,
	Puzzle,
} from "lucide-react";

import { MenuGroup } from "./MenuGroup";
import { MenuItem } from "./MenuItem";
import Settings from "./Settings";

export const singles = [{ href: "/", label: "Navbar.paths.home", Icon: Home }];

export const groups = [
	{
		label: "Navbar.paths.global.title",
		Icon: Globe,
		children: [
			{
				href: "/error",
				label: "Navbar.paths.global.error",
				Icon: MessageCircleX,
			},
			{ href: "/loading", label: "Navbar.paths.global.loading", Icon: Loader },
			{
				href: "/not-found",
				label: "Navbar.paths.global.not-found",
				Icon: CircleQuestionMark,
			},
			{ href: "/forbidden", label: "Navbar.paths.global.forbidden", Icon: Ban },
		],
	},
	{
		label: "Navbar.paths.docs.title",
		Icon: FileText,
		children: [
			{ href: "/theme", label: "Navbar.paths.docs.theme", Icon: SwatchBook },
			{
				href: "/components",
				label: "Navbar.paths.docs.components",
				Icon: Puzzle,
			},
		],
	},
];

type Props = { collapsed: boolean };

export function Sidebar({ collapsed }: Props) {
	const pathname = usePathname();

	return (
		<aside
			data-collapsed={collapsed}
			className={[
				"surface-2 border-default-3 border-r",
				"sticky top-15 h-[calc(100dvh-4rem)]",
				"flex flex-col px-2",
				"w-15 transition-[width] duration-200 data-[collapsed=false]:w-56",
			].join(" ")}
			aria-label="Primary"
		>
			<nav className="scrollbar-none my-2 min-h-0 flex-1 overflow-y-auto py-2">
				<ul className="flex flex-col gap-2">
					{singles.map(({ href, label, Icon }) => (
						<MenuItem
							key={href}
							collapsed={collapsed}
							href={href}
							label={label}
							Icon={Icon}
							active={pathname === href || pathname.startsWith(href + "/")}
						/>
					))}

					{groups.map(({ label, Icon, children }) => (
						<MenuGroup
							key={label}
							collapsed={collapsed}
							label={label}
							Icon={Icon}
							childrenItems={children}
						/>
					))}
				</ul>
			</nav>
			{!collapsed ? <Settings /> : <Settings compact />}
		</aside>
	);
}
