"use client";

import {
	ArrowUpRight,
	CopyPlus,
	PenSquare,
	ShieldCheck,
	ShieldX,
	Trash2,
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
import type { StudentsRowActionsProps } from "@/types";

export function StudentsRowActions({
	href,
	onDelete,
	onOpenEditor,
	onSetActive,
	student,
}: StudentsRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("academic.studentPage.table.actions.viewDetails")}
				onClick={() => {
					window.open(href, "_blank", "noopener,noreferrer");
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("academic.studentPage.table.actions.update")}
				onClick={() => onOpenEditor(student.accountId, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("academic.studentPage.table.actions.duplicate")}
				onClick={() => onOpenEditor(student.accountId, "duplicate")}
			/>
			<DropdownMenuSeparator />
			{student.accountActive ? (
				<DropdownMenuWarningItem
					icon={ShieldX}
					label={t("academic.studentPage.table.actions.deactivate")}
					onClick={() => onSetActive(student, false)}
				/>
			) : (
				<DropdownMenuSuccessItem
					icon={ShieldCheck}
					label={t("academic.studentPage.table.actions.reactivate")}
					onClick={() => onSetActive(student, true)}
				/>
			)}
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("academic.studentPage.table.actions.delete")}
				onClick={() => onDelete(student)}
			/>
		</>
	);
}
