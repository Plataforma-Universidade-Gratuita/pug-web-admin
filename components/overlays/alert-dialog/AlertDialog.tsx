"use client";

import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";
import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Footer, Header } from "@/components/structure/layout/Layout";
import { APP_TOPBAR_HEIGHT } from "@/constants/components";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	AlertDialogActionProps,
	AlertDialogCancelProps,
	AlertDialogContentProps,
	AlertDialogDescriptionProps,
	AlertDialogFooterProps,
	AlertDialogHeaderProps,
	AlertDialogProps,
	AlertDialogTitleProps,
} from "@/types/client";

export function AlertDialog({
	children,
	open,
	onOpenChange,
	isLoading = false,
	loadingLabel,
}: AlertDialogProps) {
	return (
		<LoadingProvider value={{ isLoading, loadingLabel }}>
			<RadixAlertDialog.Root
				open={open}
				onOpenChange={onOpenChange}
			>
				{children}
			</RadixAlertDialog.Root>
		</LoadingProvider>
	);
}

export function AlertDialogContent({
	children,
	className,
}: AlertDialogContentProps) {
	const { isLoading, loadingLabel } = useLoading();

	return (
		<RadixAlertDialog.Portal>
			<div
				className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center p-4"
				style={{ top: APP_TOPBAR_HEIGHT }}
			>
				<RadixAlertDialog.Overlay className="dialog-overlay-motion absolute inset-0 bg-black/50" />
				<RadixAlertDialog.Content
					aria-busy={isLoading || undefined}
					aria-live={isLoading ? "polite" : undefined}
					className={clsx(
						"dialog-content-motion border-default-2 surface-2 shadow-strong relative flex w-full max-w-lg flex-col overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border",
						className,
					)}
					role={isLoading ? "status" : undefined}
				>
					{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
					{children}
				</RadixAlertDialog.Content>
			</div>
		</RadixAlertDialog.Portal>
	);
}

export function AlertDialogHeader({
	children,
	className,
}: AlertDialogHeaderProps) {
	return <Header className={clsx("space-y-2", className)}>{children}</Header>;
}

export function AlertDialogTitle({
	children,
	className,
}: AlertDialogTitleProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<>
				<RadixAlertDialog.Title className="sr-only">
					{children}
				</RadixAlertDialog.Title>
				<Skeleton className={clsx("h-5 w-[48%]", className)} />
			</>
		);
	}

	return (
		<RadixAlertDialog.Title className={clsx("ty-header", className)}>
			{children}
		</RadixAlertDialog.Title>
	);
}

export function AlertDialogDescription({
	children,
	className,
}: AlertDialogDescriptionProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<div className={clsx("space-y-2", className)}>
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-[76%]" />
			</div>
		);
	}

	return (
		<RadixAlertDialog.Description className={className}>
			{children}
		</RadixAlertDialog.Description>
	);
}

export function AlertDialogFooter({
	children,
	className,
}: AlertDialogFooterProps) {
	const { isLoading } = useLoading();

	return (
		<Footer
			className={clsx(
				"border-default-2 flex shrink-0 flex-wrap items-center justify-end gap-3 border-t p-6",
				className,
			)}
			isLoading={isLoading}
		>
			{children}
		</Footer>
	);
}

export function AlertDialogCancel({ children }: AlertDialogCancelProps) {
	return <RadixAlertDialog.Cancel asChild>{children}</RadixAlertDialog.Cancel>;
}

export function AlertDialogAction({ children }: AlertDialogActionProps) {
	return <RadixAlertDialog.Action asChild>{children}</RadixAlertDialog.Action>;
}
