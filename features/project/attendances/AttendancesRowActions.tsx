"use client";

import { ArrowUpRight, Check, Trash2, UserRoundX } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuWarningItem,
} from "@/components";
import type { AttendancesRowActionsProps } from "@/types";

export function AttendancesRowActions({
	attendance,
	href,
	onDelete,
	onValidate,
}: AttendancesRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("project.attendancePage.table.actions.viewDetails")}
				onClick={() => {
					window.open(href, "_blank", "noopener,noreferrer");
				}}
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
