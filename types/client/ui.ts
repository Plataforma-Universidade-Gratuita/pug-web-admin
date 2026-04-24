import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { BUTTON_SIZES, BUTTON_USAGES, BUTTON_VARIANTS } from "@/constants/ui";

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

export interface DialogProps {
	children: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
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

export interface SectionProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;
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
