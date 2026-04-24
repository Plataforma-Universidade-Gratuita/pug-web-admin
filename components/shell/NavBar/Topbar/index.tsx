"use client";

import Link from "next/link";

import { PanelLeftClose, PanelsTopLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Icon } from "@/components";
import type { TopBarProps } from "@/types/client";

export function TopBar({ collapsed, onToggleSidebar }: TopBarProps) {
	const { t } = useTranslation();
	return (
		<header
			className="border-default-2 z-50 border-b"
			style={{ backgroundColor: "var(--twc-chrome-bg)" }}
		>
			<div className="mx-auto px-3">
				<div className="flex h-[3.75rem] items-center justify-between gap-4">
					<button
						type="button"
						onClick={onToggleSidebar}
						title={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
						className="br-squircle border-default-2 focus-ring surface-2 flex h-10 w-10 cursor-pointer items-center justify-center border transition"
						style={{
							color: "var(--twc-chrome-fg)",
						}}
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
							href="/public"
							className="ty-title no-underline"
							style={{ color: "var(--twc-chrome-fg)" }}
						>
							{t("Navbar.title")}
						</Link>
						<p
							className="ty-sm"
							style={{ color: "var(--twc-chrome-muted)" }}
						>
							{t("Navbar.subtitle")}
						</p>
					</div>
					<div
						className="ty-helper mr-5"
						style={{ color: "var(--twc-chrome-muted)" }}
					>
						PUG
					</div>
				</div>
			</div>
		</header>
	);
}
