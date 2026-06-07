"use client";

import { useTranslation } from "react-i18next";

/*
 * Exception: these overview pages import the module-page components directly to
 * keep the client/server boundary explicit during Next.js build collection.
 */
import { ModulePageComingSoon } from "@/components/composite/features/module-pages/ModulePageComingSoon";
import { ModulePageShell } from "@/components/composite/features/module-pages/ModulePageShell";

export function PartnerOverviewPage() {
	const { t } = useTranslation();

	return (
		<ModulePageShell
			title={t("partner.modulePage.title")}
			description={t("partner.modulePage.description")}
		>
			<ModulePageComingSoon
				paths={[
					{
						href: "/partner/entities",
						label: t("partner.entityPage.title"),
						description: t("partner.entityPage.description"),
					},
					{
						href: "/partner/staff",
						label: t("partner.staffPage.title"),
						description: t("partner.staffPage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
