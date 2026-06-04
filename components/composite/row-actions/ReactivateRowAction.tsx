"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuSuccessItem } from "@/components";
import type { RowActionClickProps } from "@/types";

export function ReactivateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuSuccessItem
			icon={ShieldCheck}
			label={label ?? t("common.table.actions.reactivate")}
			onClick={onClick}
		/>
	);
}
