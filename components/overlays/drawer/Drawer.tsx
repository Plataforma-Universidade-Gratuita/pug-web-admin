"use client";

import type { CSSProperties } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Footer, Header } from "@/components/structure/layout/Layout";
import { APP_TOPBAR_HEIGHT } from "@/constants/components";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	DrawerCloseProps,
	DrawerContentProps,
	DrawerDescriptionProps,
	DrawerFooterProps,
	DrawerHeaderProps,
	DrawerProps,
	DrawerSide,
	DrawerTitleProps,
	DrawerTriggerProps,
} from "@/types/client";

const DRAWER_MOTION_STYLES: Record<DrawerSide, string> = {
	top: "drawer-content-top",
	right: "drawer-content-right",
	bottom: "drawer-content-bottom",
	left: "drawer-content-left",
};

const DRAWER_POSITION_STYLES: Record<DrawerSide, string> = {
	top: "inset-x-4 top-[calc(var(--app-topbar-height)+1rem)] max-h-[min(24rem,calc(100dvh-var(--app-topbar-height)-2rem))] rounded-[var(--twc-radius-lg)]",
	right:
		"top-[var(--app-topbar-height)] right-0 h-[calc(100dvh-var(--app-topbar-height))] w-[min(32rem,100vw)] rounded-l-[var(--twc-radius-lg)]",
	bottom:
		"inset-x-4 bottom-4 max-h-[min(24rem,calc(100dvh-var(--app-topbar-height)-2rem))] rounded-[var(--twc-radius-lg)]",
	left: "top-[var(--app-topbar-height)] left-0 h-[calc(100dvh-var(--app-topbar-height))] w-[min(32rem,100vw)] rounded-r-[var(--twc-radius-lg)]",
};

export function Drawer({
	children,
	open,
	defaultOpen,
	onOpenChange,
	isLoading = false,
	loadingLabel,
}: DrawerProps) {
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

export function DrawerTrigger({ children }: DrawerTriggerProps) {
	return <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>;
}

export function DrawerClose({ children }: DrawerCloseProps) {
	return <RadixDialog.Close asChild>{children}</RadixDialog.Close>;
}

export function DrawerContent({
	children,
	className,
	side = "right",
}: DrawerContentProps) {
	const { isLoading, loadingLabel } = useLoading();

	return (
		<RadixDialog.Portal>
			<div
				className="fixed inset-0 z-40"
				style={{ "--app-topbar-height": APP_TOPBAR_HEIGHT } as CSSProperties}
			>
				<RadixDialog.Overlay
					className="drawer-overlay-motion absolute inset-0 bg-black/50"
					style={{ top: APP_TOPBAR_HEIGHT }}
				/>
				<RadixDialog.Content
					aria-busy={isLoading || undefined}
					aria-live={isLoading ? "polite" : undefined}
					className={clsx(
						"drawer-content-motion border-default-2 surface-2 shadow-strong absolute flex overflow-hidden border",
						"flex-col",
						DRAWER_POSITION_STYLES[side],
						DRAWER_MOTION_STYLES[side],
						className,
					)}
					role={isLoading ? "status" : undefined}
				>
					{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
					{children}
				</RadixDialog.Content>
			</div>
		</RadixDialog.Portal>
	);
}

export function DrawerHeader({ children, className }: DrawerHeaderProps) {
	return (
		<Header className={clsx("space-y-2 p-6", className)}>{children}</Header>
	);
}

export function DrawerTitle({ children, className }: DrawerTitleProps) {
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

export function DrawerDescription({
	children,
	className,
}: DrawerDescriptionProps) {
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

export function DrawerFooter({ children, className }: DrawerFooterProps) {
	const { isLoading } = useLoading();

	return (
		<Footer
			className={clsx(
				"border-default-2 mt-auto flex shrink-0 flex-wrap items-center justify-end gap-3 border-t p-6",
				className,
			)}
			isLoading={isLoading}
		>
			{children}
		</Footer>
	);
}
