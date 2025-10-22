"use client";

import { useState } from "react";

import { Laptop, Moon, Sun } from "lucide-react";

import { setTheme, type AppTheme } from "@/utils/theme";

export function ThemeSwitcher({ initial }: { initial?: AppTheme }) {
	const [value, setValue] = useState<AppTheme>(initial ?? "system");

	const pick = (v: AppTheme) => {
		setValue(v);
		setTheme(v);
	};

	const Btn = ({
		v,
		label,
		Icon,
	}: {
		v: AppTheme;
		label: string;
		Icon: React.ElementType;
	}) => (
		<button
			onClick={() => pick(v)}
			className={[
				"br-squircle inline-flex items-center gap-2 px-3 py-1.5",
				"border border-neutral-200 dark:border-neutral-800",
				value === v ? "surface-3 ty-sm-semibold" : "surface-2 ty-sm",
			].join(" ")}
			aria-pressed={value === v}
			aria-label={`Theme: ${label}`}
		>
			<Icon size={16} />
			{label}
		</button>
	);

	return (
		<div className="flex gap-2">
			<Btn
				v="light"
				label="Light"
				Icon={Sun}
			/>
			<Btn
				v="dark"
				label="Dark"
				Icon={Moon}
			/>
			<Btn
				v="system"
				label="System"
				Icon={Laptop}
			/>
		</div>
	);
}
