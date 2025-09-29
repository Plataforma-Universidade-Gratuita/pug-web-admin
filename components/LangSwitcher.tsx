"use client";

import { useRouter } from "next/navigation";

import { setLang } from "../utils/lang";
import type { AppLang } from "../utils/locale";

export default function LangSwitcher() {
	const router = useRouter();
	const choose = (l: AppLang) => {
		setLang(l);
		router.refresh();
	};
	return (
		<div className="flex gap-2 text-sm">
			<button
				className="border px-2 py-1"
				onClick={() => choose("pt-BR")}
			>
				pt-BR
			</button>
			<button
				className="border px-2 py-1"
				onClick={() => choose("en-US")}
			>
				en-US
			</button>
		</div>
	);
}
