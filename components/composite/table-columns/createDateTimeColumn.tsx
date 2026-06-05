"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { DateTimeColumnOptions } from "@/types";

export function createDateTimeColumn<TData extends object>({
	id,
	header,
	value,
	formattedValue,
}: DateTimeColumnOptions<TData>): ColumnDef<TData> {
	return {
		accessorFn: value,
		id,
		header: () => header,
		cell: ({ row }) => formattedValue(row.original),
	};
}
