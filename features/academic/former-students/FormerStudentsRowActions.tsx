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
import type { FormerStudentsRowActionsProps } from "@/types/client";

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
