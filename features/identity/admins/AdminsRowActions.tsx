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
	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction
				onClick={() => onOpenEditor(admin.account.id, "update")}
			/>
			<DuplicateRowAction onClick={() => onDuplicate(admin)} />
			<DropdownMenuSeparator />
			{admin.account.active && canDeactivate ? (
				<DeactivateRowAction onClick={() => onSetActive(admin, false)} />
			) : !admin.account.active ? (
				<ReactivateRowAction onClick={() => onSetActive(admin, true)} />
			) : null}
			<DeleteRowAction onClick={() => onDelete(admin)} />
		</>
	);
}
