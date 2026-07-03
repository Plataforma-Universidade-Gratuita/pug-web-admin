"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
