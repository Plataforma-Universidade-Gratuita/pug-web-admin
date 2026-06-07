"use client";

import { useTranslation } from "react-i18next";

/*
 * Exception: these overview pages import the module-page components directly to
 * keep the client/server boundary explicit during Next.js build collection.
 */
import { ModulePageComingSoon } from "@/components/composite/features/module-pages/ModulePageComingSoon";
import { ModulePageShell } from "@/components/composite/features/module-pages/ModulePageShell";

export function GeoOverviewPage() {
	const { t } = useTranslation();
	const moduleName = t("geo.modulePage.title").toLocaleLowerCase();

	return (
		<ModulePageShell
			title={t("geo.modulePage.title")}
			description={t("geo.modulePage.description")}
		>
			<ModulePageComingSoon
				moduleName={moduleName}
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
