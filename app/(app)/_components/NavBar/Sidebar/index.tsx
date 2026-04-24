"use client";

import { usePathname } from "next/navigation";

import { MenuItem } from "@/app/(app)/_components/NavBar/Sidebar/MenuItem";
import Settings from "@/app/(app)/_components/NavBar/Sidebar/Settings";
import { NAVBAR_PRIMARY_ITEMS } from "@/constants/navigation";
import type { SidebarProps } from "@/types/client";

export function Sidebar({ collapsed }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside
			data-collapsed={collapsed}
			className="app-sidebar"
			aria-label="Primary"
		>
			<nav className="app-sidebar-nav scrollbar-hidden">
				<ul className="app-sidebar-list">
					{NAVBAR_PRIMARY_ITEMS.map(({ href, label, Icon }) => (
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
