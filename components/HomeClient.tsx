"use client";

import { useTranslation } from "react-i18next";

import LangSwitcher from "../components/LangSwitcher";

export default function HomeClient() {
	const { t } = useTranslation();
	return (
		<main className="p-6">
			<h1 className="text-2xl">{t("title")}</h1>
			<LangSwitcher />
		</main>
	);
}
