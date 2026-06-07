"use client";

import { ShieldX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuWarningItem } from "@/components/primitives";
import type { RowActionClickProps } from "@/types/client";

export function DeactivateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuWarningItem
			icon={ShieldX}
			label={label ?? t("common.table.actions.deactivate")}
			onClick={onClick}
		/>
	);
}
