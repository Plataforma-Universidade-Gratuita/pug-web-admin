"use client";

import { usePathname } from "next/navigation";

import { useTranslation } from "react-i18next";

import { ScrollArea } from "@/components";
import { SIDEBAR_HOME_ITEM, SIDEBAR_NAV_GROUPS } from "@/constants/navigation";
import { AccountMenu } from "@/features/app-shell/Sidebar/AccountMenu";
import { MenuGroup } from "@/features/app-shell/Sidebar/MenuGroup";
import { MenuItem } from "@/features/app-shell/Sidebar/MenuItem";
import { isNodeActive } from "@/features/app-shell/Sidebar/utils";
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
			<ScrollArea
				className="app-sidebar-scroll"
				viewportClassName="app-sidebar-scroll-viewport"
			>
				<nav className="app-sidebar-nav">
					<ul className="app-sidebar-list">
						<MenuItem
							collapsed={collapsed}
							href={SIDEBAR_HOME_ITEM.href}
							label={SIDEBAR_HOME_ITEM.label}
							Icon={SIDEBAR_HOME_ITEM.Icon}
							active={isNodeActive(pathname, SIDEBAR_HOME_ITEM)}
						/>
						{SIDEBAR_NAV_GROUPS.map(group => (
							<MenuGroup
								key={group.label}
								collapsed={collapsed}
								label={group.label}
								Icon={group.Icon}
								childrenItems={group.childrenItems}
							/>
						))}
					</ul>
				</nav>
			</ScrollArea>
			<div className="app-sidebar-footer">
				<AccountMenu collapsed={collapsed} />
			</div>
		</aside>
	);
}
