"use client";

import { useRouter } from "next/navigation";

import { ArrowUpRight, CopyPlus, PenSquare, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components";
import type { SchoolsRowActionsProps } from "@/types";

export function SchoolsRowActions({
	href,
	onDelete,
	onOpenEditor,
	school,
}: SchoolsRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("academic.schoolPage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
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
