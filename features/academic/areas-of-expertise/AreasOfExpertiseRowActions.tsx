"use client";

import {
	DeleteRowAction,
	DuplicateRowAction,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components/composite";
import { DropdownMenuSeparator } from "@/components/primitives";
import type { AreasOfExpertiseRowActionsProps } from "@/types/client";

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
