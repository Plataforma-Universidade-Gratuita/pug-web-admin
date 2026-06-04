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
import type { CoursesRowActionsProps } from "@/types";

export function CoursesRowActions({
	course,
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
}: CoursesRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("common.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("common.table.actions.update")}
				onClick={() => onOpenEditor(course.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("common.table.actions.duplicate")}
				onClick={() => onDuplicate(course)}
			/>
			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("common.table.actions.delete")}
				onClick={() => onDelete(course)}
			/>
		</>
	);
}
