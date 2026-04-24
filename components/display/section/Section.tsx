import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Content, Footer, Header } from "@/components/structure/layout/Layout";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	SectionActionsProps,
	SectionContentProps,
	SectionDescriptionProps,
	SectionHeaderProps,
	SectionProps,
	SectionTitleProps,
} from "@/types/client";

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
				{children}
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
		<Header
			className={clsx("section-header", className)}
			{...props}
		>
			{children}
		</Header>
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
			<div
				className={clsx("space-y-2", className)}
				{...props}
			>
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-[68%]" />
			</div>
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
					className="space-y-3"
				>
					<Skeleton className="h-24 rounded-[var(--twc-radius-lg)]" />
					<div className="grid gap-3 md:grid-cols-2">
						<Skeleton className="h-12 rounded-[var(--twc-radius-lg)]" />
						<Skeleton className="h-12 rounded-[var(--twc-radius-lg)]" />
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
			<Footer
				className={clsx("section-actions", className)}
				{...props}
			>
				<Skeleton className="h-10 w-32 rounded-full" />
			</Footer>
		);
	}

	return (
		<Footer
			className={clsx("section-actions", className)}
			{...props}
		>
			{children}
		</Footer>
	);
}
