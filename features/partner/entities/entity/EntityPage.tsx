"use client";

import { useTranslation } from "react-i18next";

import { EntityDetailsContent, EntityPageShell } from "@/components";
import type { EntityPageProps } from "@/types";

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
