"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";

import { APP_TOPBAR_HEIGHT } from "@/constants/ui";
import type {
	DialogContentProps,
	DialogDescriptionProps,
	DialogFooterProps,
	DialogHeaderProps,
	DialogProps,
	DialogTitleProps,
} from "@/types/client";

export function Dialog({ children, open, onOpenChange }: DialogProps) {
	return (
		<RadixDialog.Root
			open={open}
			onOpenChange={onOpenChange}
		>
			{children}
		</RadixDialog.Root>
	);
}

export function DialogContent({ children, className }: DialogContentProps) {
	return (
		<RadixDialog.Portal>
			<div
				className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center p-4"
				style={{ top: APP_TOPBAR_HEIGHT }}
			>
				<RadixDialog.Overlay className="absolute inset-0 bg-black/50" />
				<RadixDialog.Content
					className={clsx(
						"border-default-2 surface-2 shadow-strong relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border",
						className,
					)}
					style={{ maxHeight: `calc(100dvh - ${APP_TOPBAR_HEIGHT} - 2rem)` }}
				>
					{children}
				</RadixDialog.Content>
			</div>
		</RadixDialog.Portal>
	);
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
	return <div className={clsx("space-y-2", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
	return (
		<RadixDialog.Title className={clsx("ty-header", className)}>
			{children}
		</RadixDialog.Title>
	);
}

export function DialogDescription({
	children,
	className,
}: DialogDescriptionProps) {
	return (
		<RadixDialog.Description className={className}>
			{children}
		</RadixDialog.Description>
	);
}

export function DialogFooter({ children, className }: DialogFooterProps) {
	return (
		<div
			className={clsx(
				"border-default-2 flex shrink-0 flex-wrap items-center justify-end gap-3 border-t p-6",
				className,
			)}
		>
			{children}
		</div>
	);
}
