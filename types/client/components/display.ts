import type {
	ForwardRefExoticComponent,
	HTMLAttributes,
	ReactNode,
	RefAttributes,
} from "react";

import type { LucideProps } from "lucide-react";

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
