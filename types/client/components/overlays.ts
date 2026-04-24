import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixAlertDialog from "@radix-ui/react-alert-dialog";

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
}

export interface DrawerTitleProps {
	children: ReactNode;
	className?: string;
}

export interface DrawerDescriptionProps {
	children: ReactNode;
	className?: string;
}

export interface DrawerFooterProps {
	children: ReactNode;
	className?: string;
}
