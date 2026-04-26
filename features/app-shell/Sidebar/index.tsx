"use client";

import { usePathname } from "next/navigation";

import { useTranslation } from "react-i18next";

import { NAVBAR_PRIMARY_ITEMS } from "@/constants/navigation";
import { MenuItem } from "@/features/app-shell/Sidebar/MenuItem";
import type { SidebarProps } from "@/types/client";

export function Sidebar({ collapsed }: SidebarProps) {
	const pathname = usePathname();
	const { t } = useTranslation();

	return (
		<aside
			data-collapsed={collapsed}
			className="app-sidebar"
			aria-label={t("Navbar.navigation")}
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
		</aside>
	);
}
