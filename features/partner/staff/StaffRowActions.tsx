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
import type { StaffRowActionsProps } from "@/types";

export function StaffRowActions({
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
	onSetActive,
	staff,
}: StaffRowActionsProps) {
	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction
				onClick={() => onOpenEditor(staff.account.id, "update")}
			/>
			<DuplicateRowAction onClick={() => onDuplicate(staff)} />
			<DropdownMenuSeparator />
			{staff.account.active ? (
				<DeactivateRowAction onClick={() => onSetActive(staff, false)} />
			) : (
				<ReactivateRowAction onClick={() => onSetActive(staff, true)} />
			)}
			<DeleteRowAction onClick={() => onDelete(staff)} />
		</>
	);
}
