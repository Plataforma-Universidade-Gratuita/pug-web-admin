"use client";

import { useTranslation } from "react-i18next";

/*
 * Exception: these overview pages import the module-page components directly to
 * keep the client/server boundary explicit during Next.js build collection.
 */
import { ModulePageComingSoon } from "@/components/composite/features/module-pages/ModulePageComingSoon";
import { ModulePageShell } from "@/components/composite/features/module-pages/ModulePageShell";

export function IdentityOverviewPage() {
	const { t } = useTranslation();
	const moduleName = t("identity.modulePage.title").toLocaleLowerCase();

	return (
		<ModulePageShell
			title={t("identity.modulePage.title")}
			description={t("identity.modulePage.description")}
		>
			<ModulePageComingSoon
				moduleName={moduleName}
				paths={[
					{
						href: "/identity/users",
						label: t("identity.userPage.title"),
						description: t("identity.userPage.description"),
					},
					{
						href: "/identity/accounts",
						label: t("identity.accountPage.title"),
						description: t("identity.accountPage.description"),
					},
					{
						href: "/identity/admins",
						label: t("identity.adminPage.title"),
						description: t("identity.adminPage.description"),
					},
				]}
			/>
		</ModulePageShell>
	);
}
