"use client";

import Link from "next/link";

import { PanelLeftClose, PanelsTopLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
	collapsed: boolean;
	onToggleSidebar: () => void;
};

export function TopBar({ collapsed, onToggleSidebar }: Props) {
	const { t } = useTranslation();
	return (
		<header
			className="sticky top-0 z-50 shadow-md/50"
			style={{ backgroundColor: "var(--twc-chrome-bg)" }}
		>
			<div className="mx-auto px-3">
				<div className="flex h-15 items-center justify-between">
					<button
						onClick={onToggleSidebar}
						title={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
						className="br-squircle flex h-10 w-10 cursor-pointer items-center justify-center shadow-xs transition"
						style={{
							backgroundColor: "var(--twc-chrome-bg-hover)",
							color: "var(--twc-chrome-fg)",
						}}
						aria-label={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
					>
						{collapsed ? (
							<PanelsTopLeft size={22} />
						) : (
							<PanelLeftClose size={22} />
						)}
					</button>
					<div className="flex items-baseline gap-2">
						<Link
							href="/"
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
						LOGO
					</div>
				</div>
			</div>
		</header>
	);
}
