"use client";

import clsx from "clsx";

import { Icon } from "@/components";
import { Skeleton } from "@/components";
import { Content, Footer, Header } from "@/components";
import {
	SkeletonActionGroup,
	SkeletonPanelBlock,
	SkeletonTextBlock,
} from "@/components/display/skeleton/presets";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	CardContentProps,
	CardDescriptionProps,
	CardFooterProps,
	CardHeaderProps,
	CardProps,
	CardTitleProps,
} from "@/types";

export function Card({
	children,
	className,
	isLoading = false,
	loadingLabel,
	...props
}: CardProps) {
	return (
		<LoadingProvider value={{ isLoading, loadingLabel }}>
			<div
				aria-busy={isLoading || undefined}
				aria-live={isLoading ? "polite" : undefined}
				className={clsx("card-root", className)}
				role={isLoading ? "status" : undefined}
				{...props}
			>
				{isLoading ? <span className="sr-only">{loadingLabel}</span> : null}
				{isLoading ? (
					<div
						aria-hidden="true"
						className="card-loading-shell"
					>
						<Skeleton className="card-loading-block" />
					</div>
				) : (
					children
				)}
			</div>
		</LoadingProvider>
	);
}

export function CardHeader({
	children,
	className,
	icon,
	...props
}: CardHeaderProps) {
	const { isLoading } = useLoading();

	return (
		<Header
			className={clsx("card-header", className)}
			{...props}
		>
			{icon ? (
				<div
					aria-hidden="true"
					className="card-header-icon"
				>
					{isLoading ? (
						<Skeleton className="h-5 w-5 rounded-[var(--twc-radius-sm)]" />
					) : (
						<Icon
							icon={icon}
							className="h-5 w-5 text-[color:var(--color-brand)]"
						/>
					)}
				</div>
			) : null}
			<div className="card-header-copy">{children}</div>
		</Header>
	);
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<Skeleton
				className={clsx("h-4 w-[42%]", className)}
				{...props}
			/>
		);
	}

	return (
		<h3
			className={clsx("card-title", className)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function CardDescription({
	children,
	className,
	...props
}: CardDescriptionProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<SkeletonTextBlock
				className={className}
				lines={["w-full", "w-[72%]"]}
				{...props}
			/>
		);
	}

	return (
		<p
			className={clsx("card-description", className)}
			{...props}
		>
			{children}
		</p>
	);
}

export function CardContent({
	children,
	className,
	...props
}: CardContentProps) {
	const { isLoading } = useLoading();

	return (
		<Content
			className={clsx(
				"card-content",
				isLoading ? "grid gap-3" : null,
				className,
			)}
			{...props}
		>
			{isLoading ? (
				<>
					<SkeletonTextBlock lines={["w-full", "w-[82%]", "w-[64%]"]} />
					<SkeletonPanelBlock heightClassName="h-16" />
				</>
			) : (
				children
			)}
		</Content>
	);
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
	const { isLoading } = useLoading();

	return (
		<Footer
			className={clsx("card-footer", isLoading ? "min-h-10" : null, className)}
			{...props}
		>
			{isLoading ? <SkeletonActionGroup /> : children}
		</Footer>
	);
}
