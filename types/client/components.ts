import type {
	ButtonHTMLAttributes,
	ForwardRefExoticComponent,
	HTMLAttributes,
	ReactNode,
	RefAttributes,
} from "react";

import type { LucideProps } from "lucide-react";

import {
	BUTTON_SIZES,
	BUTTON_USAGES,
	BUTTON_VARIANTS,
} from "@/constants/components";

export type ButtonUsage = keyof typeof BUTTON_USAGES;
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children"
> & {
	children?: ReactNode;
	isLoading?: boolean;
	leadingIcon?: ReactNode;
	trailingIcon?: ReactNode;
	loadingText?: string;
	size?: ButtonSize;
	tooltipContent?: ReactNode;
	usage?: ButtonUsage;
	variant?: ButtonVariant;
};

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

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	isLoading?: boolean;
}

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	isLoading?: boolean;
}

export interface FooterProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	isLoading?: boolean;
}

export interface EmptyStateProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	children?: ReactNode;
	actions?: ReactNode;
	description: ReactNode;
	icon?: ReactNode;
	title: ReactNode;
}

export interface DialogProps {
	children: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isLoading?: boolean;
	loadingLabel?: string;
}

export interface DialogContentProps {
	children: ReactNode;
	className?: string;
}

export interface DialogHeaderProps {
	children: ReactNode;
	className?: string;
}

export interface DialogTitleProps {
	children: ReactNode;
	className?: string;
}

export interface DialogDescriptionProps {
	children: ReactNode;
	className?: string;
}

export interface DialogFooterProps {
	children: ReactNode;
	className?: string;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	isLoading?: boolean;
	loadingLabel?: string;
}

export interface LoadingContextValue {
	isLoading: boolean;
	loadingLabel?: string | undefined;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

export interface CardDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
	width?: string | number;
	height?: string | number;
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;
	isLoading?: boolean;
	loadingLabel?: string;
}

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

export interface SectionDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export interface SectionContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface SectionActionsProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}
