"use client";

import { CopyPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownMenuItem } from "@/components/primitives";
import type { RowActionClickProps } from "@/types/client";

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
