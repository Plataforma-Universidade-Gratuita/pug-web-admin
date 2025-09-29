import { cookies } from "next/headers";

import LangSwitcher from "../../components/LangSwitcher";
import { coerceLang, type AppLang } from "../../utils/locale";
import { getServerComponentLocale } from "../../utils/serverComponentsLocales";

export default async function ServerDemo() {
	const raw = (await cookies()).get("lang")?.value;
	const lang: AppLang = coerceLang(raw);
	const dict = await getServerComponentLocale(lang);
	return (
		<main className="p-6">
			<h2 className="text-xl">Server says:</h2>
			<p className="mt-2">{dict.title}</p>
			<p className="mt-1 text-xs text-zinc-500">lang: {lang}</p>
			<div className="mt-4">
				<LangSwitcher />
			</div>
		</main>
	);
}
