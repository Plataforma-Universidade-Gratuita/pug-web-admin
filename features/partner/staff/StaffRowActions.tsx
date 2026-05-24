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
import type { StaffRowActionsProps } from "@/types/client";

export function StaffRowActions({
	onDelete,
	onOpenEditor,
	onSetActive,
	onView,
	staff,
}: StaffRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("partner.staffPage.table.actions.viewDetails")}
				onClick={() => onView(staff.accountId)}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("partner.staffPage.table.actions.update")}
				onClick={() => onOpenEditor(staff.accountId, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("partner.staffPage.table.actions.duplicate")}
				onClick={() => onOpenEditor(staff.accountId, "duplicate")}
			/>
			<DropdownMenuSeparator />
			{staff.accountActive ? (
				<DropdownMenuWarningItem
					icon={ShieldX}
					label={t("partner.staffPage.table.actions.deactivate")}
					onClick={() => onSetActive(staff, false)}
				/>
			) : (
				<DropdownMenuSuccessItem
					icon={ShieldCheck}
					label={t("partner.staffPage.table.actions.reactivate")}
					onClick={() => onSetActive(staff, true)}
				/>
			)}
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("partner.staffPage.table.actions.delete")}
				onClick={() => onDelete(staff)}
			/>
		</>
	);
}
