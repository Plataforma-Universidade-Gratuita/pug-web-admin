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
	onDuplicate,
	onSetActive,
	onOpenEditor,
}: AdminsRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("common.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("common.table.actions.update")}
				onClick={() => onOpenEditor(admin.account.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("common.table.actions.duplicate")}
				onClick={() => onDuplicate(admin)}
			/>
			<DropdownMenuSeparator />
			{admin.account.active && canDeactivate ? (
				<DropdownMenuWarningItem
					icon={ShieldX}
					label={t("common.table.actions.deactivate")}
					onClick={() => onSetActive(admin, false)}
				/>
			) : !admin.account.active ? (
				<DropdownMenuSuccessItem
					icon={ShieldCheck}
					label={t("common.table.actions.reactivate")}
					onClick={() => onSetActive(admin, true)}
				/>
			) : null}
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("common.table.actions.delete")}
				onClick={() => onDelete(admin)}
			/>
		</>
	);
}
