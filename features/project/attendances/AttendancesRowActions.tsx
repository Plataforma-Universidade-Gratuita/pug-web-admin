"use client";

import { useRouter } from "next/navigation";

import {
	ArrowUpRight,
	Check,
	PenSquare,
	Trash2,
	UserRoundX,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSuccessItem,
	DropdownMenuWarningItem,
} from "@/components";
import type { AttendancesRowActionsProps } from "@/types";

export function AttendancesRowActions({
	attendance,
	href,
	onDelete,
	onOpenEditor,
	onValidate,
}: AttendancesRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("project.attendancePage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("project.attendancePage.table.actions.update")}
				onClick={() => onOpenEditor(attendance.id, "update")}
			/>
			<DropdownMenuSeparator />
			{attendance.status.status !== "PRESENT" ? (
				<DropdownMenuSuccessItem
					icon={Check}
					label={t("project.attendancePage.table.actions.markPresent")}
					onClick={() => onValidate(attendance, "markPresent")}
				/>
			) : null}
			{attendance.status.status !== "ABSENT" ? (
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
