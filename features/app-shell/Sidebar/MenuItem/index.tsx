"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
