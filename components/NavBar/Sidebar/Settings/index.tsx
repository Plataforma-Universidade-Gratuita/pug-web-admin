"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import * as Popover from "@radix-ui/react-popover";
import { Laptop, Moon, Sun, Settings as Gear } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/contexts/locale";
import { useTheme } from "@/contexts/theme";
import type { AppLang } from "@/utils/locale";

import SettingCard from "./SettingCard";

type Props = { compact?: boolean };

export default function Settings({ compact = false }: Props) {
	const { mode, setMode } = useTheme();
	const { lang, setLang } = useLocale();
	const router = useRouter();
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	const selectTheme = (v: "light" | "dark" | "system") => {
		setMode(v);
		setOpen(false);
	};
	const selectLang = (l: AppLang) => {
		setLang(l);
		router.refresh();
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
					className={[
						"group relative flex h-10 w-full items-center",
						"mb-2 gap-3 rounded-2xl px-[0.725rem]",
						"surface-2 hover:surface-3 shadow-weak no-underline",
						open ? "bg-brand/15!" : "",
					].join(" ")}
					aria-label="Open settings"
				>
					<Gear
						size={20}
						strokeWidth={2}
						className={`shrink-0 ${open ? "fill-brand-700/25 stroke-brand-700" : "text-base-800"}`}
					/>
					{!compact && (
						<span
							className={[
								"ty-sm truncate",
								"data-[collapsed=false]:inline",
								open ? "text-brand-700 font-semibold" : "",
							].join(" ")}
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
					className="surface-2 br-squircle shadow-weak border-default-3 z-50 border-1 p-2"
				>
					<div className="flex w-62 flex-col gap-2">
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
					<Popover.Arrow className="fill-base-100" />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
