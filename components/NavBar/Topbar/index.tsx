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
		<header className="bg-brand shadow-brand-200 sticky top-0 z-50 shadow-md/50">
			<div className="mx-auto px-3">
				<div className="flex h-15 items-center justify-between">
					<button
						onClick={onToggleSidebar}
						title={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
						className="br-squircle bg-brand hover:bg-brand-600 shadow-brand-400 flex h-10 w-10 cursor-pointer items-center justify-center text-neutral-200 shadow-xs"
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
							className="ty-title text-neutral-50 no-underline"
						>
							{t("Navbar.title")}
						</Link>
						<p className="ty-sm text-muted text-neutral-200">
							{t("Navbar.subtitle")}
						</p>
					</div>
					<div className="ty-helper mr-5 text-neutral-200">LOGO</div>
				</div>
			</div>
		</header>
	);
}
