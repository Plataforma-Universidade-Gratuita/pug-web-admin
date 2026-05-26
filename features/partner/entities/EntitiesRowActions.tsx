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
import type { EntitiesRowActionsProps } from "@/types";

export function EntitiesRowActions({
	entity,
	href,
	onDelete,
	onOpenEditor,
}: EntitiesRowActionsProps) {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<>
			<DropdownMenuInfoItem
				icon={ArrowUpRight}
				label={t("partner.entityPage.table.actions.viewDetails")}
				onClick={() => {
					router.push(href);
				}}
			/>
			<DropdownMenuItem
				icon={PenSquare}
				label={t("partner.entityPage.table.actions.update")}
				onClick={() => onOpenEditor(entity.id, "update")}
			/>
			<DropdownMenuItem
				icon={CopyPlus}
				label={t("partner.entityPage.table.actions.duplicate")}
				onClick={() => onOpenEditor(entity.id, "duplicate")}
			/>
			<DropdownMenuSeparator />
			<DropdownMenuDangerItem
				icon={Trash2}
				label={t("partner.entityPage.table.actions.delete")}
				onClick={() => onDelete(entity)}
			/>
		</>
	);
}
