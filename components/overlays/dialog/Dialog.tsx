"use client";

import type { CSSProperties } from "react";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/actions/button/Button";
import { Icon } from "@/components/display/icon/Icon";
import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Header } from "@/components/structure/layout/Layout";
import { ScrollArea } from "@/components/structure/scroll-area/ScrollArea";
import { APP_TOPBAR_HEIGHT } from "@/constants/components";
import { LoadingProvider, useLoading } from "@/contexts/loading";
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
	const maxHeight = `calc(100dvh - ${APP_TOPBAR_HEIGHT} - 2rem)`;
	const bodyMaxHeight = `calc(100dvh - ${APP_TOPBAR_HEIGHT} - 10rem)`;

	return (
		<RadixDialog.Portal>
			<div
				className="modal-frame"
				style={{ top: APP_TOPBAR_HEIGHT }}
			>
				<RadixDialog.Overlay className="dialog-overlay-motion modal-overlay" />
				<RadixDialog.Content
					aria-busy={isLoading || undefined}
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
					{children}
				</RadixDialog.Content>
			</div>
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
		<Header className={clsx("dialog-header", className)}>
			<div className="dialog-header-main">
				{overhead ? <p className="dialog-overhead">{overhead}</p> : null}
				{children}
			</div>
			<RadixDialog.Close asChild>
				<Button
					size="icon"
					variant="secondary"
					title={t("components.dialog.close")}
					aria-label={t("components.dialog.close")}
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

export function DialogBody({ children, className }: DialogBodyProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<div className="dialog-body">
				<ScrollArea
					className="dialog-body-scroll"
					viewportClassName="dialog-body-viewport"
				>
					<div className={clsx("dialog-body-inner space-y-2", className)}>
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-[72%]" />
						<Skeleton className="h-3 w-[84%]" />
						<Skeleton className="h-3 w-[64%]" />
					</div>
				</ScrollArea>
			</div>
		);
	}

	return (
		<div className="dialog-body">
			<ScrollArea
				className="dialog-body-scroll"
				viewportClassName="dialog-body-viewport"
			>
				<div className={clsx("dialog-body-inner", className)}>{children}</div>
			</ScrollArea>
		</div>
	);
}
