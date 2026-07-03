"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuSuccessItem } from "@/components/primitives";
import type { RowActionClickProps } from "@/types/client";

export function ReactivateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuSuccessItem
			icon={ShieldCheck}
			label={label ?? t("table.actions.reactivate")}
			onClick={onClick}
		/>
	);
}
