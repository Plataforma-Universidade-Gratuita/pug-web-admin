import clsx from "clsx";

import { Skeleton } from "@/components/skeleton/Skeleton";
import type { ContentProps, FooterProps, HeaderProps } from "@/types/client";

export function Header({
	children,
	className,
	isLoading,
	...props
}: HeaderProps) {
	return (
		<div
			className={clsx(className)}
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
			className={clsx(
				isLoading ? "flex min-h-10 items-center" : null,
				className,
			)}
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
			className={clsx(isLoading ? "flex flex-wrap gap-3" : null, className)}
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
