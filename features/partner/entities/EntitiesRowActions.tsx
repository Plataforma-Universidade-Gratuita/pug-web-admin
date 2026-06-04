"use client";

import {
	DeleteRowAction,
	DuplicateRowAction,
	DropdownMenuSeparator,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components";
import type { EntitiesRowActionsProps } from "@/types";

export function EntitiesRowActions({
	entity,
	href,
	onDelete,
	onOpenEditor,
}: EntitiesRowActionsProps) {
	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction onClick={() => onOpenEditor(entity.id, "update")} />
			<DuplicateRowAction
				onClick={() => onOpenEditor(entity.id, "duplicate")}
			/>
			<DropdownMenuSeparator />
			<DeleteRowAction onClick={() => onDelete(entity)} />
		</>
	);
}
