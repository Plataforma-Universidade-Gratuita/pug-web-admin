"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/primitives";
import type { ActiveBadgeColumnOptions } from "@/types/client";

export function createActiveBadgeColumn<TData extends object>({
	id,
	header,
	value,
	activeLabel,
	inactiveLabel,
	size,
	activeTone = "success",
	inactiveTone = "danger",
}: ActiveBadgeColumnOptions<TData>): ColumnDef<TData> {
	return {
		accessorFn: value,
		id,
		meta: {
			align: "center",
		},
		header: () => <div className="table-badge-cell">{header}</div>,
		...(size !== undefined ? { size } : {}),
		cell: ({ row }) => {
			const isActive = value(row.original);

			return (
				<div className="table-badge-cell">
					<Badge
						className="min-h-5 px-2 py-0.5"
						tone={isActive ? activeTone : inactiveTone}
						variant="primary"
					>
						{isActive ? activeLabel : inactiveLabel}
					</Badge>
				</div>
			);
		},
	};
}
