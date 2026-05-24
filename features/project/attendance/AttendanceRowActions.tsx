"use client";

import { Check, Eye, Trash2, UserRoundX } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuWarningItem,
} from "@/components";
import type { AttendanceRowActionsProps } from "@/types/client/project";

export function AttendanceRowActions({
	attendance,
	onDelete,
	onValidate,
	onView,
}: AttendanceRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("project.attendancePage.table.actions.viewDetails")}
				onClick={() => onView(attendance.id)}
			/>
			<DropdownMenuSeparator />
			{attendance.status !== "PRESENT" ? (
				<DropdownMenuSuccessItem
					icon={Check}
					label={t("project.attendancePage.table.actions.markPresent")}
					onClick={() => onValidate(attendance, "markPresent")}
				/>
			) : null}
			{attendance.status !== "ABSENT" ? (
				<DropdownMenuWarningItem
					icon={UserRoundX}
					label={t("project.attendancePage.table.actions.markAbsent")}
					onClick={() => onValidate(attendance, "markAbsent")}
				/>
			) : null}
			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("project.attendancePage.table.actions.delete")}
				onClick={() => onDelete(attendance)}
			/>
		</>
	);
}
