"use client";

import Link from "next/link";

import { Globe, MoonStar, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Icon,
	Tooltip,
	ToggleGroup,
	ToggleGroupItem,
} from "@/components";
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
							<span className="app-topbar-picker-icon">
								<Icon
									icon={MoonStar}
									size={16}
								/>
							</span>
							<ToggleGroup
								type="single"
								value={mode}
								onValueChange={value => {
									if (value) {
										setMode(value as typeof mode);
									}
								}}
								className="app-topbar-toggle-group"
							>
								{THEME_OPTIONS.map(option => (
									<Tooltip
										key={option.value}
										content={t(getThemeOptionLabel(option.value))}
									>
										<ToggleGroupItem
											value={option.value}
											aria-label={t(getThemeOptionLabel(option.value))}
											className="app-topbar-mode-toggle"
										>
											<Icon
												icon={option.icon}
												size={16}
											/>
										</ToggleGroupItem>
									</Tooltip>
								))}
							</ToggleGroup>
						</div>
						<div className="app-topbar-picker app-topbar-picker-language">
							<span className="app-topbar-picker-icon">
								<Icon
									icon={Globe}
									size={16}
								/>
							</span>
							<ToggleGroup
								type="single"
								value={lang}
								onValueChange={value => {
									if (value) {
										setLang(value as typeof lang);
									}
								}}
								className="app-topbar-toggle-group"
							>
								{LANGUAGE_OPTIONS.map(option => (
									<Tooltip
										key={option.value}
										content={t(getLanguageOptionLabel(option.value))}
									>
										<ToggleGroupItem
											value={option.value}
											aria-label={t(getLanguageOptionLabel(option.value))}
											className="app-topbar-language-toggle"
										>
											{t(option.shortLabelKey)}
										</ToggleGroupItem>
									</Tooltip>
								))}
							</ToggleGroup>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
