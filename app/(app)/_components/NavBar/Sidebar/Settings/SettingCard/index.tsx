import { useState } from "react";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Icon as AppIcon } from "@/components";
import type { SettingCardProps } from "@/types/client";

export default function SettingCard({
	title,
	selectedOption = { label: "", value: "" },
	options,
}: SettingCardProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<div className="app-settings-card">
			<button
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen(v => !v)}
				className="app-settings-card-trigger"
			>
				<span className="app-settings-card-title">{t(title)}</span>
				<span className="app-settings-card-divider" />
				{selectedOption.Icon ? (
					<AppIcon
						icon={selectedOption.Icon}
						size={15}
						className="app-sidebar-item-icon-active"
					/>
				) : null}
				<span className="app-settings-card-selected">
					{t(selectedOption.label)}
				</span>
				<AppIcon
					icon={ChevronDown}
					size={16}
					className={clsx(open ? "rotate-180" : null)}
					containerClassName="app-settings-card-chevron"
				/>
			</button>
			<div
				className="app-settings-card-options"
				data-open={open ? "true" : "false"}
			>
				<ul role="listbox">
					{options.map(({ Icon, label, value, onClick }, i) => {
						const active = label === selectedOption.label;
						return (
							<li key={value}>
								<button
									role="option"
									aria-selected={active}
									onClick={() => {
										onClick();
										setOpen(false);
									}}
									className={clsx(
										"app-settings-card-option",
										active ? "app-settings-card-option-active" : null,
										i === options.length - 1 ? "rounded-b-lg" : null,
									)}
								>
									{Icon ? (
										<AppIcon
											icon={Icon}
											size={16}
											className="mr-2 inline-block"
										/>
									) : null}
									{t(label)}
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
