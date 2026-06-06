import type { ReactNode } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { BadgeTone } from "@/types";

export interface RowActionNavigateProps {
	href: string;
	label?: ReactNode;
}

export interface RowActionClickProps {
	onClick: () => void;
	label?: ReactNode;
}

export interface AccountSummaryBadgesProps {
	accountTypeFieldLabel: ReactNode;
	accountTypeLabel: ReactNode;
	accountTypeTone: BadgeTone;
	activeFieldLabel: ReactNode;
	activeLabel: ReactNode;
	activeTone: BadgeTone;
	className?: string;
}

export interface LinkedDetailsAccordionItem {
	value: string;
	title: ReactNode;
	content: ReactNode;
}

export interface LinkedDetailsAccordionProps {
	items: LinkedDetailsAccordionItem[];
	defaultValue?: string;
	className?: string;
}

export interface ResetChangesDialogProps {
	actionLabel: ReactNode;
	cancelLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
}

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
