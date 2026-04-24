"use client";

import { usePathname } from "next/navigation";

import { Home, LogIn } from "lucide-react";

import { MenuItem } from "app/(app)/_components/NavBar/Sidebar/MenuItem";
import Settings from "app/(app)/_components/NavBar/Sidebar/Settings";
import type { SidebarProps } from "types/client";

export const singles = [
	{ href: "/", label: "Navbar.paths.home", Icon: Home },
	{ href: "/login", label: "Navbar.paths.login", Icon: LogIn },
];

export function Sidebar({ collapsed }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside
			data-collapsed={collapsed}
			className={[
				"surface-2 border-default-3 border-r",
				"h-full",
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
				</ul>
			</nav>
			{!collapsed ? <Settings /> : <Settings compact />}
		</aside>
	);
}
