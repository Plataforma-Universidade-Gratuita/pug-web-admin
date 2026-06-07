"use client";

import { useTranslation } from "react-i18next";

import { AccountDetailsContent, EntityPageShell } from "@/components/composite";
import type { AccountPageProps } from "@/types/client";

export function AccountPage({ accountId }: AccountPageProps) {
	const { t } = useTranslation();

	return (
		<EntityPageShell
			title={t("identity.accountPage.dialog.titleFallback")}
			description={t("identity.accountPage.description")}
		>
			<AccountDetailsContent accountId={accountId} />
		</EntityPageShell>
	);
}
