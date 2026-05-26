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
	onOpenEditor,
}: CoursesRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("academic.coursePage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("academic.coursePage.table.actions.update")}
				onClick={() => onOpenEditor(course.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("academic.coursePage.table.actions.duplicate")}
				onClick={() => onOpenEditor(course.id, "duplicate")}
			/>
			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("academic.coursePage.table.actions.delete")}
				onClick={() => onDelete(course)}
			/>
		</>
	);
}
