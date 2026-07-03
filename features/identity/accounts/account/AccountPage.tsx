"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
