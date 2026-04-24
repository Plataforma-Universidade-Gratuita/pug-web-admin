"use client";

import Link from "next/link";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Icon as AppIcon } from "@/components";
import type { MenuItemProps } from "@/types/client";

export function MenuItem({
	collapsed,
	href,
	label,
	Icon,
	active,
}: MenuItemProps) {
	const { t } = useTranslation();
	return (
		<li key={href}>
			<Link
				href={href}
				title={t(label)}
				aria-current={active ? "page" : undefined}
				className={clsx(
					"app-sidebar-item",
					active ? "app-sidebar-item-active" : null,
				)}
				onClick={e => {
					if (active) {
						e.preventDefault();
						return;
					}
				}}
			>
				<AppIcon
					icon={Icon}
					size={20}
					strokeWidth={2}
					className={clsx(
						"app-sidebar-item-icon",
						active ? "app-sidebar-item-icon-active" : null,
					)}
				/>
				{!collapsed && (
					<span
						className={clsx(
							"app-sidebar-item-label truncate",
							active ? "app-sidebar-item-label-active" : null,
						)}
					>
						{t(label)}
					</span>
				)}
			</Link>
		</li>
	);
}
