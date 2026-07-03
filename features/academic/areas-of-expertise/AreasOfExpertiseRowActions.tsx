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
