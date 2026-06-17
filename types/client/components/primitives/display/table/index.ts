import type { HTMLAttributes, ReactNode } from "react";

import type {
	ColumnDef,
	Row,
	RowData,
	SortingState,
} from "@tanstack/react-table";

export interface TableTextProps {
	text: string;
	align?: "left" | "center" | "right";
	className?: string;
	maxWidth?: number;
	tooltiped?: boolean;
	tooltipText?: string;
}

export interface TableProps<
	TData extends RowData,
> extends HTMLAttributes<HTMLDivElement> {
	data: TData[];
	columns: ColumnDef<TData, unknown>[];
	emptyState?: ReactNode;
	isLoading?: boolean;
	loadingLabel?: string;
	loadingRowCount?: number;
	enableSorting?: boolean;
	initialSorting?: SortingState;
	getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
	getRowActions?: ((row: TData) => ReactNode) | undefined;
}

export interface RowActionsCellProps<TData extends object> {
	row: TData;
	getRowActions: NonNullable<TableProps<TData>["getRowActions"]>;
}

export interface SortIconProps {
	direction: false | "asc" | "desc";
}

export interface TableScrollbarMetricsArgs {
	clientSize: number;
	scrollOffset: number;
	scrollSize: number;
	trackSize: number;
}

export interface ScrollOffsetFromThumbOffsetArgs {
	maxScrollOffset: number;
	maxThumbOffset: number;
	thumbOffsetPx: number;
}

export interface TableScrollbarMetrics {
	isScrollable: boolean;
	thumbOffsetPx: number;
	thumbSizePx: number;
}
