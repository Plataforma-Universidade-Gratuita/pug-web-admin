"use client";

import Link from "next/link";

import { PanelLeftClose, PanelsTopLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components";
import { NAVBAR_TITLE_ROUTE } from "@/constants/navigation";
import type { TopBarProps } from "@/types/client";

export function TopBar({ collapsed, onToggleSidebar }: TopBarProps) {
	const { t } = useTranslation();
	return (
		<header className="app-topbar">
			<div className="mx-auto px-3">
				<div className="flex h-[3.75rem] items-center justify-between gap-4">
					<button
						type="button"
						onClick={onToggleSidebar}
						title={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
						className="app-topbar-toggle"
						aria-label={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
					>
						{collapsed ? (
							<Icon
								icon={PanelsTopLeft}
								size={22}
							/>
						) : (
							<Icon
								icon={PanelLeftClose}
								size={22}
							/>
						)}
					</button>
					<div className="flex items-baseline gap-2">
						<Link
							href={NAVBAR_TITLE_ROUTE}
							className="app-topbar-link ty-title"
						>
							{t("Navbar.title")}
						</Link>
						<p className="app-topbar-subtitle ty-sm">{t("Navbar.subtitle")}</p>
					</div>
					<div className="app-topbar-meta ty-helper mr-5">PUG</div>
				</div>
			</div>
		</header>
	);
}
