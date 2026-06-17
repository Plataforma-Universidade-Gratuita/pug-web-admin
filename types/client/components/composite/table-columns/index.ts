import type { ReactNode } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { BadgeTone } from "@/types/client/components/primitives/display/badge";

export interface TableTextColumnOptions<TData extends object> {
	id: string;
	header: ReactNode;
	text: (row: TData) => string;
	accessorKey?: string;
	accessorFn?: (row: TData) => unknown;
	size?: number;
	maxWidth?: number;
	tooltiped?: boolean;
}

export interface DateTimeColumnOptions<TData extends object> {
	id: string;
	header: ReactNode;
	value: (row: TData) => string;
	formattedValue: (row: TData) => ReactNode;
}

export interface ActiveBadgeColumnOptions<TData extends object> {
	id: string;
	header: ReactNode;
	value: (row: TData) => boolean;
	activeLabel: ReactNode;
	inactiveLabel: ReactNode;
	size?: number;
	activeTone?: BadgeTone;
	inactiveTone?: BadgeTone;
}

export interface ColumnFactory<TData extends object> {
	(options: TableTextColumnOptions<TData>): ColumnDef<TData>;
}
