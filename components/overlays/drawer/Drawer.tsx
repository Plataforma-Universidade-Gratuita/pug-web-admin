"use client";

import type { CSSProperties } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Footer, Header } from "@/components/structure/layout/Layout";
import {
	APP_TOPBAR_HEIGHT,
	DRAWER_MOTION_STYLES,
	DRAWER_POSITION_STYLES,
} from "@/constants/components";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	DrawerCloseProps,
	DrawerContentProps,
	DrawerDescriptionProps,
	DrawerFooterProps,
	DrawerHeaderProps,
	DrawerProps,
	DrawerTitleProps,
	DrawerTriggerProps,
} from "@/types/client";

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
				className="drawer-root"
				style={{ "--app-topbar-height": APP_TOPBAR_HEIGHT } as CSSProperties}
			>
				<RadixDialog.Overlay
					className="drawer-overlay-motion modal-overlay"
					style={{ top: APP_TOPBAR_HEIGHT }}
				/>
				<RadixDialog.Content
					aria-busy={isLoading || undefined}
					aria-live={isLoading ? "polite" : undefined}
					className={clsx(
						"drawer-content-base drawer-content-motion",
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
		<Header className={clsx("drawer-header", className)}>{children}</Header>
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
		<RadixDialog.Description className={clsx("dialog-description", className)}>
			{children}
		</RadixDialog.Description>
	);
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
	const { isLoading } = useLoading();

	return (
		<Footer
			className={clsx("drawer-footer", className)}
			isLoading={isLoading}
		>
			{children}
		</Footer>
	);
}
