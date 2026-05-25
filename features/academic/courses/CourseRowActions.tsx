"use client";

import { CopyPlus, Eye, PenSquare, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components";
import type { CourseRowActionsProps } from "@/types";

export function CourseRowActions({
	course,
	onDelete,
	onOpenEditor,
	onView,
}: CourseRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("academic.coursePage.table.actions.viewDetails")}
				onClick={() => onView(course.id)}
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
