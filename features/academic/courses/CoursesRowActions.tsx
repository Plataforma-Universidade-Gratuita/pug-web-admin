"use client";

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
