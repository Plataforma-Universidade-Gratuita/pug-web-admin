"use client";

import { useTranslation } from "react-i18next";

import {
	ModulePageComingSoon,
	ModulePageShell,
} from "@/features/shared/module-pages";

export function GeoOverviewPage() {
	const { t } = useTranslation();

	return (
		<ModulePageShell
			title={t("geo.modulePage.title")}
			description={t("geo.modulePage.description")}
		>
			<ModulePageComingSoon
				paths={[
					{
						href: "/geo/cities",
						label: t("geo.cityPage.title"),
						description: t("geo.cityPage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
