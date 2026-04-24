"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Footer, Header } from "@/components/structure/layout/Layout";
import { APP_TOPBAR_HEIGHT } from "@/constants/components";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	DialogContentProps,
	DialogDescriptionProps,
	DialogFooterProps,
	DialogHeaderProps,
	DialogProps,
	DialogTitleProps,
} from "@/types/client";

export function Dialog({
	children,
	open,
	defaultOpen,
	onOpenChange,
	isLoading = false,
	loadingLabel,
}: DialogProps) {
	const rootProps: Partial<{
		open: boolean;
		defaultOpen: boolean;
		onOpenChange: (open: boolean) => void;
	}> = {};

	if (open !== undefined) rootProps.open = open;
	if (defaultOpen !== undefined) rootProps.defaultOpen = defaultOpen;
	if (onOpenChange !== undefined) rootProps.onOpenChange = onOpenChange;

	return (
		<LoadingProvider value={{ isLoading, loadingLabel }}>
			<RadixDialog.Root {...rootProps}>{children}</RadixDialog.Root>
		</LoadingProvider>
	);
}

export function DialogContent({ children, className }: DialogContentProps) {
	const { isLoading, loadingLabel } = useLoading();

	return (
		<RadixDialog.Portal>
			<div
				className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center p-4"
				style={{ top: APP_TOPBAR_HEIGHT }}
			>
				<RadixDialog.Overlay className="absolute inset-0 bg-black/50" />
				<RadixDialog.Content
					aria-busy={isLoading || undefined}
					aria-live={isLoading ? "polite" : undefined}
					className={clsx(
						"border-default-2 surface-2 shadow-strong relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[calc(var(--twc-radius-xl)+0.25rem)] border",
						className,
					)}
					role={isLoading ? "status" : undefined}
					style={{ maxHeight: `calc(100dvh - ${APP_TOPBAR_HEIGHT} - 2rem)` }}
				>
					{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
					{children}
				</RadixDialog.Content>
			</div>
		</RadixDialog.Portal>
	);
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
	return <Header className={clsx("space-y-2", className)}>{children}</Header>;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<>
				<RadixDialog.Title className="sr-only">{children}</RadixDialog.Title>
				<Skeleton className={clsx("h-5 w-[42%]", className)} />
			</>
		);
	}

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
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<div className={clsx("space-y-2", className)}>
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-[72%]" />
			</div>
		);
	}

	return (
		<RadixDialog.Description className={className}>
			{children}
		</RadixDialog.Description>
	);
}

export function DialogFooter({ children, className }: DialogFooterProps) {
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
