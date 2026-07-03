"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
