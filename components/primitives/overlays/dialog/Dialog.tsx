"use client";

import type { CSSProperties } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/primitives/display";
import {
	SkeletonPanelBlock,
	SkeletonTextBlock,
} from "@/components/primitives/display/skeleton/presets";
import {
	getControllableOverlayRootProps,
	ModalFrame,
	OverlayCloseButton,
	OverlayHeader,
	OverlayScrollBody,
	OverlayTitle,
} from "@/components/primitives/overlays/components";
import { APP_TOPBAR_HEIGHT } from "@/components/primitives/overlays/constants";
import { LoadingProvider, useLoading } from "@/contexts";
import type {
	DialogBodyProps,
	DialogContentProps,
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

export function DialogContent({ children, className }: DialogContentProps) {
	const { isLoading, loadingLabel } = useLoading();
	const maxHeight = `calc(100dvh - ${APP_TOPBAR_HEIGHT} - 2rem)`;
	const bodyMaxHeight = `calc(100dvh - ${APP_TOPBAR_HEIGHT} - 10rem)`;

	return (
		<RadixDialog.Portal>
			<ModalFrame>
				<RadixDialog.Overlay className="dialog-overlay-motion modal-overlay" />
				<RadixDialog.Content
					aria-busy={isLoading || undefined}
					aria-describedby={undefined}
					aria-live={isLoading ? "polite" : undefined}
					className={clsx(
						"dialog-content-base dialog-content dialog-content-motion",
						className,
					)}
					role={isLoading ? "status" : undefined}
					style={
						{
							maxHeight,
							"--dialog-body-max-height": bodyMaxHeight,
						} as CSSProperties
					}
				>
					{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
					{isLoading ? (
						<div
							aria-hidden="true"
							className="dialog-loading-shell"
						>
							<Skeleton className="dialog-loading-block" />
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
			</ModalFrame>
		</RadixDialog.Portal>
	);
}

export function DialogHeader({
	children,
	className,
	overhead,
}: DialogHeaderProps) {
	const { t } = useTranslation();

	return (
		<OverlayHeader
			className={clsx("dialog-header", className)}
			mainClassName="dialog-header-main"
			overhead={overhead}
			overheadClassName="dialog-overhead"
			closeButton={<OverlayCloseButton label={t("components.dialog.close")} />}
		>
			{children}
		</OverlayHeader>
	);
}

export function DialogTitle({ children, className }: DialogTitleProps) {
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

export function DialogBody({ children, className }: DialogBodyProps) {
	return (
		<OverlayScrollBody
			outerClassName="dialog-body"
			scrollClassName="dialog-body-scroll"
			viewportClassName="dialog-body-viewport"
			innerClassName="dialog-body-inner"
			loadingClassName="grid gap-4"
			className={className}
			loadingContent={
				<>
					<SkeletonTextBlock lines={["w-full", "w-[78%]", "w-[84%]"]} />
					<SkeletonPanelBlock heightClassName="h-28" />
					<SkeletonTextBlock lines={["w-[68%]", "w-[52%]"]} />
				</>
			}
		>
			{children}
		</OverlayScrollBody>
	);
}
