"use client";

import { useRouter } from "next/navigation";

import { ArrowUpRight, CopyPlus, PenSquare, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components";
import type { AreasOfExpertiseRowActionsProps } from "@/types";

export function AreasOfExpertiseRowActions({
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
	areaOfExpertise,
}: AreasOfExpertiseRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("academic.schoolPage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("academic.schoolPage.table.actions.update")}
				onClick={() => onOpenEditor(areaOfExpertise.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("academic.schoolPage.table.actions.duplicate")}
				onClick={() => onDuplicate(areaOfExpertise)}
			/>
			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("academic.schoolPage.table.actions.delete")}
				onClick={() => onDelete(areaOfExpertise)}
			/>
		</>
	);
}
