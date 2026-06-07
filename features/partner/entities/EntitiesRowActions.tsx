"use client";

import {
	DeleteRowAction,
	DuplicateRowAction,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components/composite";
import { DropdownMenuSeparator } from "@/components/primitives";
import type { EntitiesRowActionsProps } from "@/types/client";

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
