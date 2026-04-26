"use client";

import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import { Content, Footer, Header } from "@/components/structure/layout/Layout";
import { LoadingProvider, useLoading } from "@/contexts/loading";
import type {
	CardContentProps,
	CardDescriptionProps,
	CardFooterProps,
	CardHeaderProps,
	CardProps,
	CardTitleProps,
} from "@/types/client";

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
				{children}
			</div>
		</LoadingProvider>
	);
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
	return (
		<Header
			className={clsx("card-header", className)}
			{...props}
		>
			{children}
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
			<div
				className={clsx("space-y-2", className)}
				{...props}
			>
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-[72%]" />
			</div>
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
				isLoading ? "flex min-h-10 items-center" : null,
				className,
			)}
			{...props}
		>
			{isLoading ? <Skeleton className="h-10 w-32 rounded-full" /> : children}
		</Content>
	);
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
	const { isLoading } = useLoading();

	return (
		<Footer
			className={clsx(
				"card-footer",
				isLoading ? "flex flex-wrap gap-3" : null,
				className,
			)}
			{...props}
		>
			{isLoading ? (
				<>
					<Skeleton className="h-10 w-24 rounded-full" />
					<Skeleton className="h-10 w-32 rounded-full" />
				</>
			) : (
				children
			)}
		</Footer>
	);
}
