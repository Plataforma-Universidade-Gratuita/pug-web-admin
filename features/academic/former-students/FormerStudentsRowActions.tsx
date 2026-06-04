"use client";

import {
	DeactivateRowAction,
	DeleteRowAction,
	DuplicateRowAction,
	DropdownMenuSeparator,
	ReactivateRowAction,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components";
import type { FormerStudentsRowActionsProps } from "@/types";

export function FormerStudentsRowActions({
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
	onSetActive,
	formerStudent,
}: FormerStudentsRowActionsProps) {
	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction
				onClick={() => onOpenEditor(formerStudent.accountId, "update")}
			/>
			<DuplicateRowAction onClick={() => onDuplicate(formerStudent)} />
			<DropdownMenuSeparator />
			{formerStudent.account?.active ? (
				<DeactivateRowAction onClick={() => onSetActive(formerStudent)} />
			) : (
				<ReactivateRowAction onClick={() => onSetActive(formerStudent)} />
			)}
			<DeleteRowAction onClick={() => onDelete(formerStudent)} />
		</>
	);
}
