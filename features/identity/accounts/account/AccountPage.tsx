"use client";

import { useTranslation } from "react-i18next";

import { AccountDetailsContent } from "@/features/identity/accounts/account/AccountDetailsContent";
import { EntityPageShell } from "@/features/shared/entity-pages";
import type { AccountPageProps } from "@/types";

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
