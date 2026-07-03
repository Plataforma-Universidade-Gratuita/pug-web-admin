"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ColumnDef } from "@tanstack/react-table";

import type { DateTimeColumnOptions } from "@/types/client";

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
