"use client";

import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuDangerItem } from "@/components";
import type { RowActionClickProps } from "@/types";

export function DeleteRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuDangerItem
			icon={Trash2}
			label={label ?? t("common.table.actions.delete")}
			onClick={onClick}
		/>
	);
}
