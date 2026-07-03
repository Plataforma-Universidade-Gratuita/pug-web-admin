"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { PenSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuItem } from "@/components/primitives";
import type { RowActionClickProps } from "@/types/client";

export function UpdateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuItem
			icon={PenSquare}
			label={label ?? t("table.actions.update")}
			onClick={onClick}
		/>
	);
}
