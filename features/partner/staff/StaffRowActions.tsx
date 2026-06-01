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
import type { StaffRowActionsProps } from "@/types";

export function StaffRowActions({
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
	onSetActive,
	staff,
}: StaffRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("partner.staffPage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("partner.staffPage.table.actions.update")}
				onClick={() => onOpenEditor(staff.account.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("partner.staffPage.table.actions.duplicate")}
				onClick={() => onDuplicate(staff)}
			/>
			<DropdownMenuSeparator />
			{staff.account.active ? (
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
