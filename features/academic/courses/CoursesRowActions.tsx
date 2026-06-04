"use client";

import {
	DeleteRowAction,
	DuplicateRowAction,
	DropdownMenuSeparator,
	UpdateRowAction,
	ViewDetailsRowAction,
} from "@/components";
import type { CoursesRowActionsProps } from "@/types";

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
