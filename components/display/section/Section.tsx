"use client";

import clsx from "clsx";

import { Skeleton } from "@/components";
import { Content } from "@/components";
import {
	SkeletonActionGroup,
	SkeletonPanelBlock,
	SkeletonTextBlock,
} from "@/components/display/skeleton/presets";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	SectionActionsProps,
	SectionContentProps,
	SectionDescriptionProps,
	SectionHeaderProps,
	SectionProps,
	SectionTitleProps,
} from "@/types";

export function Section({
	children,
	className,
	isLoading = false,
	loadingLabel,
	...props
}: SectionProps) {
	return (
		<LoadingProvider value={{ isLoading, loadingLabel }}>
			<section
				aria-busy={isLoading || undefined}
				aria-live={isLoading ? "polite" : undefined}
				className={clsx("section-root", className)}
				role={isLoading ? "status" : undefined}
				{...props}
			>
				{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
				{isLoading ? (
					<div
						aria-hidden="true"
						className="section-loading-shell"
					>
						<Skeleton className="section-loading-block" />
					</div>
				) : (
					children
				)}
			</section>
		</LoadingProvider>
	);
}

export function SectionHeader({
	children,
	className,
	...props
}: SectionHeaderProps) {
	return (
		<header
			className={clsx("section-header", className)}
			{...props}
		>
			{children}
		</header>
	);
}

export function SectionTitle({
	children,
	className,
	...props
}: SectionTitleProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<Skeleton
				className={clsx("h-5 w-[38%]", className)}
				{...props}
			/>
		);
	}

	return (
		<h2
			className={clsx("section-title", className)}
			{...props}
		>
			{children}
		</h2>
	);
}

export function SectionDescription({
	children,
	className,
	...props
}: SectionDescriptionProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<SkeletonTextBlock
				className={className}
				lines={["w-full", "w-[68%]"]}
				{...props}
			/>
		);
	}

	return (
		<p
			className={clsx("section-description", className)}
			{...props}
		>
			{children}
		</p>
	);
}

export function SectionContent({
	children,
	className,
	...props
}: SectionContentProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<Content
				className={clsx("section-content", className)}
				{...props}
			>
				<div
					aria-hidden="true"
					className="grid gap-4"
				>
					<div className="grid gap-3 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-3)] p-4">
						<Skeleton className="h-4 w-[28%]" />
						<SkeletonTextBlock lines={["w-full", "w-[84%]"]} />
					</div>
					<div className="grid gap-3 md:grid-cols-2">
						<div className="grid gap-3 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-3)] p-4">
							<Skeleton className="h-4 w-[42%]" />
							<SkeletonPanelBlock heightClassName="h-14" />
						</div>
						<div className="grid gap-3 rounded-[var(--twc-radius-xl)] border border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-3)] p-4">
							<Skeleton className="h-4 w-[38%]" />
							<SkeletonPanelBlock heightClassName="h-14" />
						</div>
					</div>
				</div>
			</Content>
		);
	}

	return (
		<Content
			className={clsx("section-content", className)}
			{...props}
		>
			{children}
		</Content>
	);
}

export function SectionActions({
	children,
	className,
	...props
}: SectionActionsProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<div
				className={clsx("section-actions", className)}
				{...props}
			>
				<SkeletonActionGroup className="justify-end" />
			</div>
		);
	}

	return (
		<div
			className={clsx("section-actions", className)}
			{...props}
		>
			{children}
		</div>
	);
}
