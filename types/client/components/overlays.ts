import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixAlertDialog from "@radix-ui/react-alert-dialog";

export interface DialogProps {
	children: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
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
}

export interface DialogTitleProps {
	children: ReactNode;
	className?: string;
}

export interface DialogDescriptionProps {
	children: ReactNode;
	className?: string;
}

export interface DialogFooterProps {
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

export interface AlertDialogContentProps {
	children: ReactNode;
	className?: string;
}

export interface AlertDialogHeaderProps {
	children: ReactNode;
	className?: string;
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
	children: ReactNode;
	className?: string;
}

export interface AlertDialogCancelProps
	extends ComponentPropsWithoutRef<typeof RadixAlertDialog.Cancel> {
	children: ReactNode;
}

export interface AlertDialogActionProps
	extends ComponentPropsWithoutRef<typeof RadixAlertDialog.Action> {
	children: ReactNode;
}
