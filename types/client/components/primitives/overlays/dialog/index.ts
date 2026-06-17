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
