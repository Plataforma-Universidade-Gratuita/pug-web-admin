"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { Eraser } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/primitives/actions";
import { Icon, Skeleton } from "@/components/primitives/display";
import {
	SkeletonActionGroup,
	SkeletonPanelBlock,
	SkeletonTextBlock,
} from "@/components/primitives/display/skeleton/presets";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter as AlertDialogFooterActions,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/primitives/overlays/alert-dialog";
import {
	getControllableOverlayRootProps,
	OverlayCloseButton,
	OverlayDescription,
	OverlayHeader,
	OverlayScrollBody,
	OverlayTitle,
} from "@/components/primitives/overlays/components";
import { APP_TOPBAR_HEIGHT } from "@/components/primitives/overlays/constants";
import {
	DRAWER_MOTION_STYLES,
	DRAWER_POSITION_STYLES,
} from "@/components/primitives/overlays/drawer/constants";
import { Footer } from "@/components/primitives/structure";
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
} from "@/types/client";

export function Drawer({
	children,
	open,
	defaultOpen,
	onOpenChange,
	isLoading = false,
	loadingLabel,
}: DrawerProps) {
	const rootProps = getControllableOverlayRootProps(
		open,
		defaultOpen,
		onOpenChange,
	);

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
		<OverlayHeader
			className={clsx("drawer-header", className)}
			mainClassName="drawer-header-main"
			overhead={overhead}
			overheadClassName="drawer-overhead"
			closeButton={<OverlayCloseButton label={t("components.drawer.close")} />}
		>
			{children}
		</OverlayHeader>
	);
}

export function DrawerTitle({ children, className }: DrawerTitleProps) {
	return (
		<OverlayTitle
			TitleComponent={RadixDialog.Title}
			skeletonClassName="h-5 w-[42%]"
			className={className}
		>
			{children}
		</OverlayTitle>
	);
}

export function DrawerDescription({
	children,
	className,
}: DrawerDescriptionProps) {
	return (
		<OverlayDescription
			DescriptionComponent={RadixDialog.Description}
			skeletonLines={["w-full", "w-[72%]"]}
			className={className}
		>
			{children}
		</OverlayDescription>
	);
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
	return (
		<OverlayScrollBody
			outerClassName="drawer-body"
			scrollClassName="drawer-body-scroll"
			viewportClassName="drawer-body-viewport"
			innerClassName="drawer-body-inner"
			loadingClassName="grid gap-4"
			className={className}
			loadingContent={
				<>
					<SkeletonTextBlock lines={["w-full", "w-[76%]"]} />
					<div className="grid gap-3 md:grid-cols-2">
						<SkeletonPanelBlock heightClassName="h-12" />
						<SkeletonPanelBlock heightClassName="h-12" />
					</div>
					<SkeletonPanelBlock heightClassName="h-40" />
				</>
			}
		>
			{children}
		</OverlayScrollBody>
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
