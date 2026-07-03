/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ReactNode } from "react";

export interface DialogProps {
	children: ReactNode;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
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
	overhead?: ReactNode;
}

export interface DialogTitleProps {
	children: ReactNode;
	className?: string;
}

export interface DialogBodyProps {
	children: ReactNode;
	className?: string;
}
