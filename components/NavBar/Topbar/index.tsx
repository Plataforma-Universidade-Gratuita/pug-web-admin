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
		<header className="bg-brand shadow-normal sticky top-0 z-50 border-b">
			<div className="mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<button
						onClick={onToggleSidebar}
						className="br-squircle bg-brand hover:bg-brand-700 dark:hover:bg-brand-500 shadow-weak flex h-10 w-10 items-center justify-center text-neutral-200"
						aria-label="Toggle sidebar"
					>
						{collapsed ? (
							<PanelsTopLeft size={18} />
						) : (
							<PanelLeftClose size={18} />
						)}
					</button>
					<div className="flex items-center gap-2">
						<Link
							href="/"
							className="ty-header text-neutral-50 no-underline"
						>
							{t("title")}
						</Link>
						<p className="ty-sm text-muted text-neutral-200">{t("subtitle")}</p>
					</div>
					<div className="ty-helper mr-5 text-neutral-200">LOGO</div>
				</div>
			</div>
		</header>
	);
}
