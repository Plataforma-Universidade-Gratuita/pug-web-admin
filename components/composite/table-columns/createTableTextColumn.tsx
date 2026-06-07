"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { TableText } from "@/components/primitives";
import type { TableTextColumnOptions } from "@/types/client";

export function createTableTextColumn<TData extends object>({
	id,
	header,
	text,
	accessorKey,
	accessorFn,
	size,
	maxWidth,
	tooltiped = true,
}: TableTextColumnOptions<TData>): ColumnDef<TData> {
	return {
		...(accessorKey ? { accessorKey } : {}),
		...(accessorFn ? { accessorFn } : {}),
		id,
		header: () => header,
		...(size !== undefined ? { size } : {}),
		cell: ({ row }) => (
			<TableText
				text={text(row.original)}
				{...(maxWidth !== undefined ? { maxWidth } : {})}
				tooltiped={tooltiped}
			/>
		),
	};
}
