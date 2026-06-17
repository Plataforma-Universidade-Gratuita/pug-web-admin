import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

export type DrawerSide = "top" | "right" | "bottom" | "left";
export type DrawerVariant = "filters" | "create";

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
