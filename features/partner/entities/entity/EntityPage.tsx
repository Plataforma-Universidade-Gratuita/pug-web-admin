"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { useTranslation } from "react-i18next";

import { EntityDetailsContent, EntityPageShell } from "@/components/composite";
import type { EntityPageProps } from "@/types/client";

export function EntityPage({ entityId }: EntityPageProps) {
	const { t } = useTranslation();

	return (
		<EntityPageShell
			title={t("partner.entityPage.dialog.titleFallback")}
			description={t("partner.entityPage.description")}
		>
			<EntityDetailsContent entityId={entityId} />
		</EntityPageShell>
	);
}
