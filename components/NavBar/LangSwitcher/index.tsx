"use client";

import { useRouter } from "next/navigation";

import { setLang } from "@/utils/lang";
import type { AppLang } from "@/utils/locale";

export function LangSwitcher() {
	const router = useRouter();
	const choose = (l: AppLang) => {
		setLang(l);
		router.refresh();
	};
	const Btn = ({ v, label }: { v: AppLang; label: string }) => (
		<button
			onClick={() => choose(v)}
			className="surface-2 hover:surface-3 br-squircle ty-sm border border-neutral-200 px-3 py-1.5 dark:border-neutral-800"
			aria-label={`Lang: ${label}`}
		>
			{label}
		</button>
	);
	return (
		<div className="flex gap-2">
			<Btn
				v="pt-BR"
				label="pt-BR"
			/>
			<Btn
				v="en-US"
				label="en-US"
			/>
		</div>
	);
}
