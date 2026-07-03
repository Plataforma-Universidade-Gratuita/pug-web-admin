"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { CopyPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuItem } from "@/components/primitives";
import type { RowActionClickProps } from "@/types/client";

export function DuplicateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuItem
			icon={CopyPlus}
			label={label ?? t("table.actions.duplicate")}
			onClick={onClick}
		/>
	);
}
