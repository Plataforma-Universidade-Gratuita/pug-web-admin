"use client";

import {
	DeactivateRowAction,
	DeleteRowAction,
	DuplicateRowAction,
	ReactivateRowAction,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components/composite";
import { DropdownMenuSeparator } from "@/components/primitives";
import type { AdminsRowActionsProps } from "@/types/client";

export function AdminsRowActions({
	admin,
	canDeactivate,
	canDelete,
	href,
	onDelete,
	onDuplicate,
	onSetActive,
	onOpenEditor,
}: AdminsRowActionsProps) {
	const showStatusAction = admin.account.active ? canDeactivate : true;
	const showDeleteAction = canDelete;
	const showManagementActions = showStatusAction || showDeleteAction;

	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction
				onClick={() => onOpenEditor(admin.account.id, "update")}
			/>
			<DuplicateRowAction onClick={() => onDuplicate(admin)} />
			{showManagementActions ? <DropdownMenuSeparator /> : null}
			{admin.account.active && canDeactivate ? (
				<DeactivateRowAction onClick={() => onSetActive(admin, false)} />
			) : !admin.account.active ? (
				<ReactivateRowAction onClick={() => onSetActive(admin, true)} />
			) : null}
			{showDeleteAction ? (
				<DeleteRowAction onClick={() => onDelete(admin)} />
			) : null}
		</>
	);
}
