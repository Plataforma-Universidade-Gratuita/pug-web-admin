"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { Eraser, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components";
import { Icon } from "@/components";
import { Skeleton } from "@/components";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter as AlertDialogFooterActions,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components";
import { Footer, Header } from "@/components";
import { ScrollArea } from "@/components";
import {
	SkeletonActionGroup,
	SkeletonPanelBlock,
	SkeletonTextBlock,
} from "@/components/primitives/display/skeleton/presets";
import {
	APP_TOPBAR_HEIGHT,
	DRAWER_MOTION_STYLES,
	DRAWER_POSITION_STYLES,
} from "@/constants";
import { LoadingProvider, useLoading } from "@/contexts";
import type {
	DrawerBodyProps,
	DrawerCloseProps,
	DrawerContentProps,
	DrawerDescriptionProps,
	DrawerFooterProps,
	DrawerHeaderProps,
	DrawerProps,
	DrawerTitleProps,
	DrawerTriggerProps,
} from "@/types";

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
	const bodyMaxHeight = `calc(100dvh - ${APP_TOPBAR_HEIGHT} - 11rem)`;

	return (
		<RadixDialog.Portal>
			<div className="drawer-root">
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
					style={
						{
							"--app-topbar-height": APP_TOPBAR_HEIGHT,
							"--drawer-body-max-height": bodyMaxHeight,
						} as CSSProperties
					}
				>
					{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
					{isLoading ? (
						<div
							aria-hidden="true"
							className="drawer-loading-shell"
						>
							<Skeleton className="drawer-loading-block" />
						</div>
					) : (
						children
					)}
					{isLoading ? (
						<RadixDialog.Title className="sr-only">
							{loadingLabel}
						</RadixDialog.Title>
					) : null}
				</RadixDialog.Content>
			</div>
		</RadixDialog.Portal>
	);
}

export function DrawerHeader({
	children,
	className,
	overhead,
}: DrawerHeaderProps) {
	const { t } = useTranslation();

	return (
		<Header className={clsx("drawer-header", className)}>
			<div className="drawer-header-main">
				{overhead ? <p className="drawer-overhead">{overhead}</p> : null}
				{children}
			</div>
			<RadixDialog.Close asChild>
				<Button
					size="icon"
					variant="secondary"
					title={t("components.drawer.close")}
					aria-label={t("components.drawer.close")}
				>
					<Icon
						icon={X}
						className="h-4 w-4"
					/>
				</Button>
			</RadixDialog.Close>
		</Header>
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
			<SkeletonTextBlock
				className={className}
				lines={["w-full", "w-[72%]"]}
			/>
		);
	}

	return (
		<RadixDialog.Description className={clsx("dialog-description", className)}>
			{children}
		</RadixDialog.Description>
	);
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<div className="drawer-body">
				<ScrollArea
					className="drawer-body-scroll"
					viewportClassName="drawer-body-viewport"
				>
					<div className={clsx("drawer-body-inner grid gap-4", className)}>
						<SkeletonTextBlock lines={["w-full", "w-[76%]"]} />
						<div className="grid gap-3 md:grid-cols-2">
							<SkeletonPanelBlock heightClassName="h-12" />
							<SkeletonPanelBlock heightClassName="h-12" />
						</div>
						<SkeletonPanelBlock heightClassName="h-40" />
					</div>
				</ScrollArea>
			</div>
		);
	}

	return (
		<div className="drawer-body">
			<ScrollArea
				className="drawer-body-scroll"
				viewportClassName="drawer-body-viewport"
			>
				<div className={clsx("drawer-body-inner", className)}>{children}</div>
			</ScrollArea>
		</div>
	);
}

export function DrawerFooter({
	className,
	clearConfirmDescription,
	clearConfirmTitle,
	clearLabel,
	actionLabel,
	actionIcon,
	actionVariant = "filters",
	onAction,
	onClear,
}: DrawerFooterProps) {
	const { isLoading } = useLoading();
	const { t } = useTranslation();
	const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
	return (
		<>
			<Footer
				className={clsx("drawer-footer", className)}
				isLoading={isLoading}
			>
				{isLoading ? (
					<SkeletonActionGroup className="w-full justify-between" />
				) : (
					<>
						<Button
							variant="secondary"
							usage="danger"
							leadingIcon={
								<Icon
									icon={Eraser}
									className="h-4 w-4"
								/>
							}
							onClick={() => setIsClearConfirmOpen(true)}
						>
							{clearLabel}
						</Button>
						<Button
							usage={actionVariant === "create" ? "success" : "info"}
							leadingIcon={
								actionIcon ? (
									<Icon
										icon={actionIcon}
										className="h-4 w-4"
									/>
								) : undefined
							}
							onClick={onAction}
						>
							{actionLabel}
						</Button>
					</>
				)}
			</Footer>

			<AlertDialog
				open={isClearConfirmOpen}
				onOpenChange={setIsClearConfirmOpen}
			>
				<AlertDialogContent variant="danger">
					<AlertDialogHeader>
						<AlertDialogTitle>{clearConfirmTitle}</AlertDialogTitle>
						<AlertDialogDescription>
							{clearConfirmDescription}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooterActions
						cancelLabel={t("common.cancel")}
						actionLabel={clearLabel}
						onAction={() => {
							onClear?.();
							setIsClearConfirmOpen(false);
						}}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
