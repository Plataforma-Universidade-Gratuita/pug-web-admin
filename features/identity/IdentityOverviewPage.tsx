"use client";

import { useTranslation } from "react-i18next";

import {
	ModulePageComingSoon,
	ModulePageShell,
} from "@/features/shared/module-pages";

export function IdentityOverviewPage() {
	const { t } = useTranslation();

	return (
		<ModulePageShell
			title={t("identity.modulePage.title")}
			description={t("identity.modulePage.description")}
		>
			<ModulePageComingSoon
				paths={[
					{
						href: "/identity/user",
						label: t("identity.userPage.title"),
						description: t("identity.userPage.description"),
					},
					{
						href: "/identity/account",
						label: t("identity.accountPage.title"),
						description: t("identity.accountPage.description"),
					},
					{
						href: "/identity/admin",
						label: t("identity.adminPage.title"),
						description: t("identity.adminPage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
