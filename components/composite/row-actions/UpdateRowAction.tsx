"use client";

import { PenSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuItem } from "@/components";
import type { RowActionClickProps } from "@/types";

export function UpdateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuItem
			icon={PenSquare}
			label={label ?? t("common.table.actions.update")}
			onClick={onClick}
		/>
	);
}
