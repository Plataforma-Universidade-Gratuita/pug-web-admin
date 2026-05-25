"use client";

import { CopyPlus, Eye, PenSquare, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	DropdownMenuDangerItem,
	DropdownMenuInfoItem,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components";
import type { EntityRowActionsProps } from "@/types";

export function EntityRowActions({
	entity,
	onDelete,
	onOpenEditor,
	onView,
}: EntityRowActionsProps) {
	const { t } = useTranslation();

	return (
		<>
			<DropdownMenuInfoItem
				icon={Eye}
				label={t("partner.entityPage.table.actions.viewDetails")}
				onClick={() => onView(entity.id)}
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
