"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuDangerItem } from "@/components/primitives";
import type { RowActionClickProps } from "@/types/client";

export function DeleteRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuDangerItem
			icon={Trash2}
			label={label ?? t("table.actions.delete")}
			onClick={onClick}
		/>
	);
}
