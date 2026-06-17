import type { HTMLAttributes, ReactNode } from "react";

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
