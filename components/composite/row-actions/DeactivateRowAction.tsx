"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { ShieldX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuWarningItem } from "@/components/primitives";
import type { RowActionClickProps } from "@/types/client";

export function DeactivateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuWarningItem
			icon={ShieldX}
			label={label ?? t("table.actions.deactivate")}
			onClick={onClick}
		/>
	);
}
