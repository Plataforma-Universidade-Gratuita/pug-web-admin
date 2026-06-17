import type { ReactNode } from "react";

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
