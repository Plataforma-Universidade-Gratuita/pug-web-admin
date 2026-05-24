"use client";

import {
	CopyPlus,
	Eye,
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
import type { StudentRowActionsProps } from "@/types/client/academic";

export function StudentRowActions({
	onDelete,
	onOpenEditor,
	onSetActive,
	onView,
	student,
}: StudentRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("academic.studentPage.table.actions.viewDetails")}
				onClick={() => onView(student.accountId)}
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
