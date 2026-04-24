import type {
	ComponentPropsWithoutRef,
	ForwardRefExoticComponent,
	HTMLAttributes,
	ReactNode,
	RefAttributes,
} from "react";

import type * as RadixLabel from "@radix-ui/react-label";
import type * as RadixScrollArea from "@radix-ui/react-scroll-area";
import type * as RadixSeparator from "@radix-ui/react-separator";
import type { LucideProps } from "lucide-react";

import { BADGE_TONES, BADGE_VARIANTS } from "@/constants/components";

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
	onOpenChange?: ((open: boolean) => void) | undefined;
}

export interface PopoverTriggerProps {
	children: ReactNode;
}

export interface PopoverContentProps {
	children: ReactNode;
	className?: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
}

export type IconComponent = ForwardRefExoticComponent<
	Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface IconProps
	extends Omit<HTMLAttributes<HTMLSpanElement>, "title"> {
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

export interface EmptyStateProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	children?: ReactNode;
	actions?: ReactNode;
	description: ReactNode;
	icon?: ReactNode;
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

export interface LabelProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixLabel.Root>, "children"> {
	children: ReactNode;
}

export interface SeparatorProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixSeparator.Root>,
		"children"
	> {
	orientation?: "horizontal" | "vertical";
	decorative?: boolean;
	className?: string;
}

export interface ScrollAreaProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixScrollArea.Root>,
		"children"
	> {
	children: ReactNode;
	className?: string;
	viewportClassName?: string;
}
