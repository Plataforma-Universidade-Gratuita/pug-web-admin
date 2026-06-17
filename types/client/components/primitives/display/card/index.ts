import type { HTMLAttributes, ReactNode } from "react";

import type { IconComponent } from "../icon";

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
