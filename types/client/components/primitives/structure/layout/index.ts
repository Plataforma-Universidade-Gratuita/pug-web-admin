/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type {
	ComponentPropsWithoutRef,
	HTMLAttributes,
	ReactNode,
} from "react";

export interface PageShellProps extends ComponentPropsWithoutRef<"main"> {
	width?: "default" | "wide";
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
