"use client";

import Link from "next/link";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button, Icon, LanguageSelector, ThemeSelector } from "@/components";
import { NAVBAR_TITLE_ROUTE } from "@/constants/navigation";
import { useLocale } from "@/contexts/locale";
import { useTheme } from "@/contexts/theme";
import {
	LANGUAGE_OPTIONS,
	THEME_OPTIONS,
	getLanguageOptionLabel,
	getThemeOptionLabel,
} from "@/features/app-shell/Topbar/utils";
import type { TopBarProps } from "@/types/client";

export function TopBar({ collapsed, onToggleSidebar }: TopBarProps) {
	const { t } = useTranslation();
	const { lang, setLang } = useLocale();
	const { mode, setMode } = useTheme();
	const themeSelectorOptions = THEME_OPTIONS.map(option => ({
		value: option.value,
		icon: option.icon,
		label: t(getThemeOptionLabel(option.value)),
	}));
	const languageSelectorOptions = LANGUAGE_OPTIONS.map(option => ({
		value: option.value,
		label: t(getLanguageOptionLabel(option.value)),
		shortLabel: t(option.shortLabelKey),
	}));

	return (
		<header className="app-topbar">
			<div className="mx-auto px-3">
				<div className="flex h-[3.75rem] items-center justify-between gap-4">
					<Button
						size="icon"
						usage="secondary"
						variant="ghost"
						onClick={onToggleSidebar}
						title={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
						className="app-topbar-toggle"
						aria-label={collapsed ? t("Navbar.expand") : t("Navbar.collapse")}
						leadingIcon={
							<Icon
								icon={collapsed ? PanelLeftOpen : PanelLeftClose}
								size={18}
							/>
						}
					/>
					<div className="flex min-w-0 flex-1 items-baseline gap-2">
						<Link
							href={NAVBAR_TITLE_ROUTE}
							className="app-topbar-link ty-title truncate"
						>
							{t("Navbar.title")}
						</Link>
						<p className="app-topbar-subtitle ty-sm hidden truncate sm:block">
							{t("Navbar.subtitle")}
						</p>
					</div>
					<div className="app-topbar-controls">
						<div className="app-topbar-picker app-topbar-picker-theme">
							<ThemeSelector
								value={mode}
								options={themeSelectorOptions}
								onValueChange={setMode}
							/>
						</div>
						<div className="app-topbar-picker app-topbar-picker-language">
							<LanguageSelector
								value={lang}
								options={languageSelectorOptions}
								onValueChange={setLang}
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
