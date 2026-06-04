"use client";

import {
	DeleteRowAction,
	DuplicateRowAction,
	DropdownMenuSeparator,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components";
import type { AreasOfExpertiseRowActionsProps } from "@/types";

export function AreasOfExpertiseRowActions({
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
	areaOfExpertise,
}: AreasOfExpertiseRowActionsProps) {
	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction
				onClick={() => onOpenEditor(areaOfExpertise.id, "update")}
			/>
			<DuplicateRowAction onClick={() => onDuplicate(areaOfExpertise)} />
			<DropdownMenuSeparator />
			<DeleteRowAction onClick={() => onDelete(areaOfExpertise)} />
		</>
	);
}
