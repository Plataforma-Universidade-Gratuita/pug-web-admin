"use client";

import { SidebarRow } from "@/features/app-shell/Sidebar/SidebarRow";
import type { MenuItemProps } from "@/types/client";

export function MenuItem({
	collapsed,
	href,
	label,
	Icon,
	active,
	depth = 0,
}: MenuItemProps) {
	return (
		<li key={href}>
			<SidebarRow
				kind="link"
				href={href}
				collapsed={collapsed}
				label={label}
				Icon={Icon}
				active={active}
				depth={depth}
			/>
		</li>
	);
}
