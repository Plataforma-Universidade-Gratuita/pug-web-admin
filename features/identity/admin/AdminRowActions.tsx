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
import type { AdminRowActionsProps } from "@/types";

export function AdminRowActions({
	admin,
	canDeactivate,
	onDelete,
	onSetActive,
	onView,
	onOpenEditor,
}: AdminRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("identity.adminPage.table.actions.viewDetails")}
				onClick={() => onView(admin.accountId)}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("identity.adminPage.table.actions.update")}
				onClick={() => onOpenEditor(admin.accountId, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("identity.adminPage.table.actions.duplicate")}
				onClick={() => onOpenEditor(admin.accountId, "duplicate")}
			/>
			<DropdownMenuSeparator />
			{admin.accountActive && canDeactivate ? (
				<DropdownMenuWarningItem
					icon={ShieldX}
					label={t("identity.adminPage.table.actions.deactivate")}
					onClick={() => onSetActive(admin, false)}
				/>
			) : !admin.accountActive ? (
				<DropdownMenuSuccessItem
					icon={ShieldCheck}
					label={t("identity.adminPage.table.actions.reactivate")}
					onClick={() => onSetActive(admin, true)}
				/>
			) : null}
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("identity.adminPage.table.actions.delete")}
				onClick={() => onDelete(admin)}
			/>
		</>
	);
}
