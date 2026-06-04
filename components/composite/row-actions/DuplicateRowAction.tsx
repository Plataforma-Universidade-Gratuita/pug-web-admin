"use client";

import { CopyPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuItem } from "@/components";
import type { RowActionClickProps } from "@/types";

export function DuplicateRowAction({ onClick, label }: RowActionClickProps) {
	const { t } = useTranslation();

	return (
		<DropdownMenuItem
			icon={CopyPlus}
			label={label ?? t("common.table.actions.duplicate")}
			onClick={onClick}
		/>
	);
}
