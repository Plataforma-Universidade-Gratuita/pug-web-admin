import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

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

export interface AlertDialogProps {
	children: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isLoading?: boolean;
	loadingLabel?: string;
}

export type AlertDialogVariant = "default" | "success" | "warning" | "danger";

export interface AlertDialogContentProps {
	children: ReactNode;
	className?: string;
	variant?: AlertDialogVariant;
}

export interface AlertDialogHeaderProps {
	children: ReactNode;
	className?: string;
	overhead?: ReactNode;
}

export interface AlertDialogTitleProps {
	children: ReactNode;
	className?: string;
}

export interface AlertDialogDescriptionProps {
	children: ReactNode;
	className?: string;
}

export interface AlertDialogFooterProps {
	children?: ReactNode;
	className?: string;
	cancelLabel?: ReactNode;
	actionLabel?: ReactNode;
	onAction?: () => void;
}

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerProps {
	children: ReactNode;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	isLoading?: boolean;
	loadingLabel?: string;
}

export interface DrawerTriggerProps {
	children: ReactNode;
}

export interface DrawerCloseProps {
	children: ReactNode;
}

export interface DrawerContentProps {
	children: ReactNode;
	className?: string;
	side?: DrawerSide;
}

export interface DrawerHeaderProps {
	children: ReactNode;
	className?: string;
	overhead?: ReactNode;
}

export interface DrawerTitleProps {
	children: ReactNode;
	className?: string;
}

export interface DrawerDescriptionProps {
	children: ReactNode;
	className?: string;
}

export type DrawerVariant = "filters" | "create";

export interface DrawerBodyProps {
	children: ReactNode;
	className?: string;
}

export interface DrawerFooterProps {
	className?: string;
	clearConfirmDescription: ReactNode;
	clearConfirmTitle: ReactNode;
	clearLabel: ReactNode;
	actionLabel: ReactNode;
	actionIcon?: LucideIcon;
	actionVariant?: DrawerVariant;
	onAction?: () => void;
	onClear?: () => void;
}
