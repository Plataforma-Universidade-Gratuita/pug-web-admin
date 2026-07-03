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
import type { CoursesRowActionsProps } from "@/types/client";

export function CoursesRowActions({
	course,
	href,
	onDelete,
	onDuplicate,
	onOpenEditor,
}: CoursesRowActionsProps) {
	return (
		<>
			<ViewDetailsRowAction href={href} />
			<UpdateRowAction onClick={() => onOpenEditor(course.id, "update")} />
			<DuplicateRowAction onClick={() => onDuplicate(course)} />
			<DropdownMenuSeparator />
			<DeleteRowAction onClick={() => onDelete(course)} />
		</>
	);
}
