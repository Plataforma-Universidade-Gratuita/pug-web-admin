"use client";

import { createContext, useContext } from "react";

import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/primitives/actions";
import { Skeleton } from "@/components/primitives/display";
import { SkeletonActionGroup } from "@/components/primitives/display/skeleton/presets";
import {
	ModalFrame,
	OverlayDescription,
	OverlayHeader,
	OverlayTitle,
} from "@/components/primitives/overlays/components";
import { Footer } from "@/components/primitives/structure";
import { LoadingProvider, useLoading } from "@/contexts";
import type {
	AlertDialogContentProps,
	AlertDialogDescriptionProps,
	AlertDialogFooterProps,
	AlertDialogHeaderProps,
	AlertDialogProps,
	AlertDialogTitleProps,
	AlertDialogVariant,
} from "@/types/client";

const AlertDialogVariantContext = createContext<AlertDialogVariant>("default");

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
	variant = "default",
}: AlertDialogContentProps) {
	const { isLoading, loadingLabel } = useLoading();

	return (
		<AlertDialogVariantContext.Provider value={variant}>
			<RadixAlertDialog.Portal>
				<ModalFrame>
					<RadixAlertDialog.Overlay className="dialog-overlay-motion modal-overlay" />
					<RadixAlertDialog.Content
						aria-busy={isLoading || undefined}
						aria-live={isLoading ? "polite" : undefined}
						className={clsx(
							"alert-dialog-content dialog-content-base dialog-content-motion",
							className,
						)}
						role={isLoading ? "status" : undefined}
					>
						{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
						{isLoading ? (
							<div
								aria-hidden="true"
								className="alert-dialog-loading-shell"
							>
								<Skeleton className="alert-dialog-loading-block" />
							</div>
						) : (
							children
						)}
						{isLoading ? (
							<RadixAlertDialog.Title className="sr-only">
								{loadingLabel}
							</RadixAlertDialog.Title>
						) : null}
					</RadixAlertDialog.Content>
				</ModalFrame>
			</RadixAlertDialog.Portal>
		</AlertDialogVariantContext.Provider>
	);
}

export function AlertDialogHeader({
	children,
	className,
	overhead,
}: AlertDialogHeaderProps) {
	const { t } = useTranslation();
	const variant = useContext(AlertDialogVariantContext);
	const resolvedOverhead =
		overhead ??
		(variant === "success"
			? t("AlertDialog.overhead.success")
			: variant === "warning"
				? t("AlertDialog.overhead.warning")
				: variant === "danger"
					? t("AlertDialog.overhead.danger")
					: null);

	return (
		<OverlayHeader
			className={clsx("alert-dialog-header dialog-header", className)}
			mainClassName="alert-dialog-header-main"
			overhead={resolvedOverhead}
			overheadClassName="alert-dialog-overhead"
		>
			{children}
		</OverlayHeader>
	);
}

export function AlertDialogTitle({
	children,
	className,
}: AlertDialogTitleProps) {
	return (
		<OverlayTitle
			TitleComponent={RadixAlertDialog.Title}
			skeletonClassName="h-5 w-[48%]"
			className={className}
		>
			{children}
		</OverlayTitle>
	);
}

export function AlertDialogDescription({
	children,
	className,
}: AlertDialogDescriptionProps) {
	return (
		<OverlayDescription
			DescriptionComponent={RadixAlertDialog.Description}
			skeletonLines={["w-full", "w-[76%]"]}
			className={className}
		>
			{children}
		</OverlayDescription>
	);
}

export function AlertDialogFooter({
	children,
	actionLabel,
	cancelLabel,
	className,
	onAction,
}: AlertDialogFooterProps) {
	const { isLoading } = useLoading();
	const variant = useContext(AlertDialogVariantContext);
	const actionUsage =
		variant === "success"
			? "success"
			: variant === "warning"
				? "warning"
				: variant === "danger"
					? "danger"
					: "primary";

	return (
		<Footer
			className={clsx(
				"alert-dialog-footer dialog-footer flex w-full flex-wrap items-center justify-end gap-3 border-t border-[color:var(--twc-border-2)] px-6 py-4",
				className,
			)}
			isLoading={isLoading}
		>
			{isLoading ? (
				<SkeletonActionGroup />
			) : children ? (
				children
			) : (
				<>
					<RadixAlertDialog.Cancel asChild>
						<Button variant="secondary">{cancelLabel}</Button>
					</RadixAlertDialog.Cancel>
					<RadixAlertDialog.Action asChild>
						<Button
							usage={actionUsage}
							onClick={onAction}
						>
							{actionLabel}
						</Button>
					</RadixAlertDialog.Action>
				</>
			)}
		</Footer>
	);
}
