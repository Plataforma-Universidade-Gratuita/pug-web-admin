import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import type { ContentProps, FooterProps, HeaderProps } from "@/types/client";
import type { PageShellProps } from "@/types/client/components/structure/layout";

export function PageShell({
	children,
	className,
	width = "default",
	...props
}: PageShellProps) {
	return (
		<main
			className={clsx(
				"page-shell",
				width === "wide" ? "page-shell-wide" : null,
				className,
			)}
			{...props}
		>
			{children}
		</main>
	);
}

export function Header({
	children,
	className,
	isLoading,
	...props
}: HeaderProps) {
	return (
		<div
			className={clsx(isLoading ? "layout-loading-copy" : null, className)}
			{...props}
		>
			{isLoading ? (
				<div
					aria-hidden="true"
					className="space-y-2"
				>
					<Skeleton className="h-4 w-[42%]" />
					<Skeleton className="h-3 w-[72%]" />
				</div>
			) : (
				children
			)}
		</div>
	);
}

export function Content({
	children,
	className,
	isLoading,
	...props
}: ContentProps) {
	return (
		<div
			className={clsx(isLoading ? "layout-content-loading" : null, className)}
			{...props}
		>
			{isLoading ? <Skeleton className="h-10 w-32 rounded-full" /> : children}
		</div>
	);
}

export function Footer({
	children,
	className,
	isLoading,
	...props
}: FooterProps) {
	return (
		<div
			className={clsx(isLoading ? "layout-footer-loading" : null, className)}
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
		</div>
	);
}
