"use client";

import { useTranslation } from "react-i18next";

export default function Page() {
	const { t } = useTranslation();

	return <main className="mx-auto max-w-6xl space-y-8 p-6"></main>;
}
