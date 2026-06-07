"use client";

import Image from "next/image";
import Link from "next/link";

import { KeyRound, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LanguageSelector, ThemeSelector } from "@/components/composite";
import { Button, Icon } from "@/components/primitives";
import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "@/constants";
import { NAVBAR_TITLE_ROUTE } from "@/constants";
import { useLocale, useTheme } from "@/contexts";
import type { TopBarProps } from "@/types/client";

export function TopBar({
	collapsed,
	onToggleSidebar,
	showWireCredentialsAction = false,
	onOpenWireCredentials,
}: TopBarProps) {
	const { t } = useTranslation();
	const { lang, setLang } = useLocale();
	const { mode, setMode } = useTheme();
	const themeSelectorOptions = THEME_OPTIONS.map(option => ({
		value: option.value,
		icon: option.icon,
		label: t(option.labelKey),
	}));
	const languageSelectorOptions = LANGUAGE_OPTIONS.map(option => ({
		value: option.value,
		label: t(option.labelKey),
		shortLabel: t(option.shortLabelKey),
	}));

	return (
		<header className="app-topbar">
			<div className="mx-auto px-3">
				<div className="relative flex h-[3.75rem] items-center justify-between gap-4">
					<Button
						size="icon"
						usage="secondary"
						variant="secondary"
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
					<Link
						href={NAVBAR_TITLE_ROUTE}
						className="app-topbar-brand"
						aria-label={t("Navbar.title")}
					>
						<Image
							src="/assets/brand/pug-logo-inverted.svg"
							alt={t("Navbar.title")}
							width={75}
							height={75}
							className="app-topbar-brand-image"
							priority
						/>
					</Link>
					<div className="app-topbar-controls">
						{showWireCredentialsAction ? (
							<Button
								usage="light"
								variant="secondary"
								onClick={onOpenWireCredentials}
								title={t("auth.login.wireCredentials.reopen")}
								leadingIcon={
									<Icon
										icon={KeyRound}
										size={16}
									/>
								}
							>
								{t("auth.login.wireCredentials.reopen")}
							</Button>
						) : null}
						<div className="app-topbar-picker app-topbar-picker-theme">
							<ThemeSelector
								value={mode}
								options={themeSelectorOptions}
								onValueChange={setMode}
								colorVariant="chrome"
							/>
						</div>
						<div className="app-topbar-picker app-topbar-picker-language">
							<LanguageSelector
								value={lang}
								options={languageSelectorOptions}
								onValueChange={setLang}
								colorVariant="chrome"
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
