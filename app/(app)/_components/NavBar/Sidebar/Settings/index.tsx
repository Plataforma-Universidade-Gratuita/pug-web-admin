"use client";

import { useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { Laptop, Moon, Sun, Settings as Gear } from "lucide-react";
import { useTranslation } from "react-i18next";

import SettingCard from "@/app/(app)/_components/NavBar/Sidebar/Settings/SettingCard";
import { Icon } from "@/components";
import { useLocale } from "@/contexts/locale";
import { useTheme } from "@/contexts/theme";
import type { AppLang, AppTheme, SettingsProps } from "@/types/client";

export default function Settings({ compact = false }: SettingsProps) {
	const { mode, setMode } = useTheme();
	const { lang, setLang } = useLocale();
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	const selectTheme = (v: AppTheme) => {
		setMode(v);
		setOpen(false);
	};
	const selectLang = (l: AppLang) => {
		if (l === lang) {
			setOpen(false);
			return;
		}

		setLang(l);
		setOpen(false);
	};

	const themeSelected = {
		label:
			mode === "light"
				? "Navbar.settings.themes.light"
				: mode === "dark"
					? "Navbar.settings.themes.dark"
					: "Navbar.settings.themes.system",
		value: mode,
		Icon: mode === "light" ? Sun : mode === "dark" ? Moon : Laptop,
	} as const;

	const langSelected = {
		label:
			lang === "en-US"
				? "Navbar.settings.languages.en-US"
				: "Navbar.settings.languages.pt-BR",
		value: lang,
	} as const;

	return (
		<Popover.Root
			open={open}
			onOpenChange={setOpen}
		>
			<Popover.Trigger asChild>
				<button
					className={clsx(
						"app-sidebar-item mb-2",
						open ? "app-sidebar-item-active" : null,
					)}
					aria-label="Open settings"
				>
					<Icon
						icon={Gear}
						size={20}
						strokeWidth={2}
						className={clsx(
							"app-sidebar-item-icon",
							open ? "app-sidebar-item-icon-active" : null,
						)}
					/>
					{!compact && (
						<span
							className={clsx(
								"app-sidebar-item-label truncate",
								open ? "app-sidebar-item-label-active" : null,
							)}
						>
							{t("Navbar.settings.title")}
						</span>
					)}
				</button>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					side="right"
					align="end"
					collisionPadding={8}
					sideOffset={15}
					onEscapeKeyDown={() => setOpen(false)}
					onCloseAutoFocus={() => setOpen(false)}
					className="app-settings-panel"
				>
					<div className="app-settings-panel-inner">
						<SettingCard
							title="Navbar.settings.themes.title"
							selectedOption={themeSelected}
							options={[
								{
									Icon: Sun,
									label: "Navbar.settings.themes.light",
									value: "light",
									onClick: () => selectTheme("light"),
								},
								{
									Icon: Moon,
									label: "Navbar.settings.themes.dark",
									value: "dark",
									onClick: () => selectTheme("dark"),
								},
								{
									Icon: Laptop,
									label: "Navbar.settings.themes.system",
									value: "system",
									onClick: () => selectTheme("system"),
								},
							]}
						/>
						<SettingCard
							title="Navbar.settings.languages.title"
							selectedOption={langSelected}
							options={[
								{
									label: "Navbar.settings.languages.en-US",
									value: "en-US",
									onClick: () => selectLang("en-US"),
								},
								{
									label: "Navbar.settings.languages.pt-BR",
									value: "pt-BR",
									onClick: () => selectLang("pt-BR"),
								},
							]}
						/>
					</div>
					<Popover.Arrow className="app-settings-panel-arrow" />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
