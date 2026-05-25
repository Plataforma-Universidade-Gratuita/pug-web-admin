"use client";

import { useTranslation } from "react-i18next";

import {
	ModulePageComingSoon,
	ModulePageShell,
} from "@/features/shared/module-pages";

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
