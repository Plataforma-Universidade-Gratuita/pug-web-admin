"use client";

import { useRouter } from "next/navigation";

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
import type { FormerStudentsRowActionsProps } from "@/types";

export function FormerStudentsRowActions({
	href,
	onDelete,
	onOpenEditor,
	onSetActive,
	formerStudent,
}: FormerStudentsRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("academic.studentPage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("academic.studentPage.table.actions.update")}
				onClick={() => onOpenEditor(formerStudent.accountId, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("academic.studentPage.table.actions.duplicate")}
				onClick={() => onOpenEditor(formerStudent.accountId, "duplicate")}
			/>
			<DropdownMenuSeparator />
			{formerStudent.account?.active ? (
				<DropdownMenuWarningItem
					icon={ShieldX}
					label={t("academic.studentPage.table.actions.deactivate")}
					onClick={() => onSetActive(formerStudent)}
				/>
			) : (
				<DropdownMenuSuccessItem
					icon={ShieldCheck}
					label={t("academic.studentPage.table.actions.reactivate")}
					onClick={() => onSetActive(formerStudent)}
				/>
			)}
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("academic.studentPage.table.actions.delete")}
				onClick={() => onDelete(formerStudent)}
			/>
		</>
	);
}


