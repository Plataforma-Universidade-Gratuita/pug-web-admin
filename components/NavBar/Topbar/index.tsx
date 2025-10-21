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
    <header className="bg-brand border-b-6 border-accent sticky top-0 z-50">
      <div className="mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
					<button
						onClick={onToggleSidebar}
						className="br-squircle bg-brand dark:hover:bg-brand-500 hover:bg-brand-700 shadow-weak flex h-10 w-10 items-center justify-center"
						aria-label="Toggle sidebar"
					>
						{collapsed ? <PanelsTopLeft size={18} /> : <PanelLeftClose size={18} />}
					</button>
          <div className="flex items-center gap-2">
            <Link href="/" className="ty-header no-underline">{t("title")}</Link>
            <p className="ty-sm text-muted">{t("subtitle")}</p>
          </div>
					<div className="mr-5 ty-helper">
						LOGO
					</div>
        </div>
      </div>
    </header>
  );
}
