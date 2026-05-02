"use client";

import { createContext, useContext } from "react";

import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/actions/button/Button";
import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Footer, Header } from "@/components/structure/layout/Layout";
import { APP_TOPBAR_HEIGHT } from "@/constants/components";
import { LoadingProvider, useLoading } from "@/contexts/loading";
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
				<div
					className="modal-frame"
					style={{ top: APP_TOPBAR_HEIGHT }}
				>
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
						{children}
					</RadixAlertDialog.Content>
				</div>
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
		<Header className={clsx("alert-dialog-header dialog-header", className)}>
			{resolvedOverhead ? (
				<p className="alert-dialog-overhead">{resolvedOverhead}</p>
			) : null}
			{children}
		</Header>
	);
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
		<RadixAlertDialog.Description
			className={clsx("dialog-description", className)}
		>
			{children}
		</RadixAlertDialog.Description>
	);
}

export function AlertDialogFooter({
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
			className={clsx("alert-dialog-footer dialog-footer", className)}
			isLoading={isLoading}
		>
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
		</Footer>
	);
}
