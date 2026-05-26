"use client";

import { useRouter } from "next/navigation";

import {
	CopyPlus,
	PenSquare,
	ShieldCheck,
	ShieldX,
	Trash2,
	ArrowUpRight,
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
import type { AdminsRowActionsProps } from "@/types";

export function AdminsRowActions({
	admin,
	canDeactivate,
	href,
	onDelete,
	onSetActive,
	onOpenEditor,
}: AdminsRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("identity.adminPage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
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
