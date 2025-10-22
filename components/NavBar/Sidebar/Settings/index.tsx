"use client";

import {
	useState,
} from "react";

import { useRouter } from "next/navigation";

import * as Popover from "@radix-ui/react-popover";
import {
	Laptop,
	Moon,
	Sun,
	Settings as Gear,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { setLang } from "@/utils/lang";
import type { AppLang } from "@/utils/locale";
import { setTheme, type AppTheme } from "@/utils/theme";

import SettingCard from "./SettingCard";

type Props = { compact?: boolean };

export default function Settings({ compact = false }: Props) {
	const router = useRouter();
	const { t } = useTranslation();
	const pickTheme = (v: AppTheme) => setTheme(v);
	const pickLang = (l: AppLang) => {
		setLang(l);
		router.refresh();
	};
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleModalClose = () => {
		setIsOpen(false);
	};

	const Panel = (
		<div className="flex w-56 flex-col gap-2">
			<SettingCard
				title="Navbar.settings.themes.title"
				options={[
					{
						Icon: Sun,
						label: "Navbar.settings.themes.light",
						value: "light",
						onClick: () => pickTheme("light"),
					},
					{
						Icon: Moon,
						label: "Navbar.settings.themes.dark",
						value: "dark",
						onClick: () => pickTheme("dark"),
					},
					{
						Icon: Laptop,
						label: "Navbar.settings.themes.system",
						value: "system",
						onClick: () => pickTheme("system"),
					},
				]}
			/>
			<SettingCard
				title="Navbar.settings.languages.title"
				options={[
					{
						label: "Navbar.settings.languages.en-US",
						value: "en-US",
						onClick: () => pickLang("en-US"),
					},
					{
						label: "Navbar.settings.languages.pt-BR",
						value: "pt-BR",
						onClick: () => pickLang("pt-BR"),
					},
				]}
			/>
		</div>
	);

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<button
					className={[
						"group relative flex h-10 w-full items-center",
						"mb-2 gap-3 rounded-2xl px-[0.725rem]",
						"surface-2 hover:surface-3 shadow-weak no-underline",
						isOpen ? "bg-brand/15!" : "",
					].join(" ")}
					aria-label="Open settings"
					onClick={() => setIsOpen(v => !v)}
				>
					<Gear
						size={20}
						strokeWidth={2}
						className={`shrink-0 ${isOpen ? "fill-brand-700/25 stroke-brand-700" : "text-base-800"}`}
					/>
					{!compact && (
						<span
							className={[
								"ty-sm truncate",
								"data-[collapsed=false]:inline",
								`${isOpen ? "text-brand-700 font-semibold" : ""}`,
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
					onCloseAutoFocus={handleModalClose}
					onEscapeKeyDown={handleModalClose}
					collisionPadding={8}
					sideOffset={15}
					className="surface-2 br-squircle shadow-weak border-default-3 z-50 border-1 p-2"
				>
					{Panel}
					<Popover.Arrow className="fill-base-100" />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
