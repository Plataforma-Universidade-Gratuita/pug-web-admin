"use client";

import { CopyPlus, Eye, PenSquare, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components";
import type { SchoolRowActionsProps } from "@/types/client/academic";

export function SchoolRowActions({
	onDelete,
	onOpenEditor,
	onView,
	school,
}: SchoolRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("academic.schoolPage.table.actions.viewDetails")}
				onClick={() => onView(school.id)}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("academic.schoolPage.table.actions.update")}
				onClick={() => onOpenEditor(school.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("academic.schoolPage.table.actions.duplicate")}
				onClick={() => onOpenEditor(school.id, "duplicate")}
			/>
			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("academic.schoolPage.table.actions.delete")}
				onClick={() => onDelete(school)}
			/>
		</>
	);
}
