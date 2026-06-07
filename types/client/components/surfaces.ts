import type { HTMLAttributes, ReactNode } from "react";

import type { IconComponent } from "@/types/client/components/display";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	isLoading?: boolean;
	loadingLabel?: string;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	icon?: IconComponent;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
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
	isLoading?: boolean;
	loadingLabel?: string;
}

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

export interface SectionDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export interface SectionContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export interface SectionActionsProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}
