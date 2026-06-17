import type { ReactNode } from "react";

export interface ServicePageConfirmDialogProps {
	actionLabel: ReactNode;
	cancelLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
	variant?: "danger" | "success" | "warning";
}

export interface RecordActionDialogConfig {
	actionLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
	variant?: "danger" | "success" | "warning";
}

export interface RecordActionDialogsProps {
	cancelLabel: ReactNode;
	deleteDialog?: RecordActionDialogConfig;
	statusDialog?: RecordActionDialogConfig;
}

export interface ResetChangesDialogProps {
	actionLabel: ReactNode;
	cancelLabel: ReactNode;
	description: ReactNode;
	onAction: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	title: ReactNode;
}
