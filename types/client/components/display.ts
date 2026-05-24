import type {
	ComponentPropsWithoutRef,
	ForwardRefExoticComponent,
	HTMLAttributes,
	ReactNode,
	RefAttributes,
} from "react";

import type * as RadixLabel from "@radix-ui/react-label";
import type * as RadixPopover from "@radix-ui/react-popover";
import type * as RadixScrollArea from "@radix-ui/react-scroll-area";
import type * as RadixSeparator from "@radix-ui/react-separator";
import type {
	ColumnDef,
	Row,
	RowData,
	SortingState,
} from "@tanstack/react-table";
import type { LucideProps } from "lucide-react";

import { BADGE_TONES, BADGE_VARIANTS } from "@/constants/components";
import type { ToggleGroupColorVariant } from "@/types/client/components/controls";
import type { AppLang } from "@/types/client/locale";
import type { AppTheme } from "@/types/client/theme";

export type BadgeTone = keyof typeof BADGE_TONES;
export type BadgeVariant = keyof typeof BADGE_VARIANTS;

export interface TooltipProps {
	children: ReactNode;
	content: ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}

export interface PopoverProps {
	children: ReactNode;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	modal?: boolean | undefined;
}

export interface PopoverTriggerProps {
	children: ReactNode;
	className?: string;
}

export interface PopoverContentProps {
	children: ReactNode;
	className?: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
	avoidCollisions?: boolean;
	withArrow?: boolean;
	collisionPadding?:
		| number
		| Partial<Record<"top" | "right" | "bottom" | "left", number>>;
	collisionBoundary?: ComponentPropsWithoutRef<
		typeof RadixPopover.Content
	>["collisionBoundary"];
	onCloseAutoFocus?: ComponentPropsWithoutRef<
		typeof RadixPopover.Content
	>["onCloseAutoFocus"];
	onEscapeKeyDown?: ComponentPropsWithoutRef<
		typeof RadixPopover.Content
	>["onEscapeKeyDown"];
}

export type IconComponent = ForwardRefExoticComponent<
	Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface IconProps extends Omit<
	HTMLAttributes<HTMLSpanElement>,
	"title"
> {
	icon: IconComponent;
	label?: string;
	tooltipContent?: ReactNode;
	decorative?: boolean;
	isLoading?: boolean;
	size?: number;
	strokeWidth?: number;
	containerClassName?: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}

export interface EmptyStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"title"
> {
	children?: ReactNode;
	actions?: ReactNode;
	description: ReactNode;
	icon?: ReactNode;
	title: ReactNode;
}

export interface NoContentStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"children" | "title"
> {
	description?: ReactNode;
	title: ReactNode;
}

export interface SomeErrorStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"children" | "title"
> {
	description: ReactNode;
	onRefresh: () => void;
	title: ReactNode;
}

export interface NotFoundStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"children" | "title"
> {
	description?: ReactNode;
	title: ReactNode;
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
	width?: string | number;
	height?: string | number;
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	tone?: BadgeTone;
	variant?: BadgeVariant;
	onRemove?: (() => void) | undefined;
	removeLabel?: string;
}

export interface LabelProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixLabel.Root>,
	"children"
> {
	children: ReactNode;
}

export interface SeparatorProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSeparator.Root>,
	"children"
> {
	orientation?: "horizontal" | "vertical";
	decorative?: boolean;
	className?: string;
}

export interface ScrollAreaProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixScrollArea.Root>,
	"children"
> {
	children: ReactNode;
	className?: string;
	viewportClassName?: string;
}

export interface ThemeSelectorOption {
	value: AppTheme;
	icon: IconComponent;
	label: string;
}

export interface ThemeSelectorProps {
	value: AppTheme;
	options: ThemeSelectorOption[];
	onValueChange: (value: AppTheme) => void;
	colorVariant?: ToggleGroupColorVariant;
	className?: string;
}

export interface LanguageSelectorOption {
	value: AppLang;
	label: string;
	shortLabel: string;
}

export interface LanguageSelectorProps {
	value: AppLang;
	options: LanguageSelectorOption[];
	onValueChange: (value: AppLang) => void;
	colorVariant?: ToggleGroupColorVariant;
	className?: string;
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
