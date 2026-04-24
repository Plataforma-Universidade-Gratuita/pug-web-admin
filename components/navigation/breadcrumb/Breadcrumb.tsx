"use client";

import clsx from "clsx";
import { ChevronRight } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import type {
	BreadcrumbCurrentProps,
	BreadcrumbItemProps,
	BreadcrumbLinkProps,
	BreadcrumbListProps,
	BreadcrumbProps,
	BreadcrumbSeparatorProps,
} from "@/types/client";

export function Breadcrumb({ children, className, ...props }: BreadcrumbProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className={className}
			{...props}
		>
			{children}
		</nav>
	);
}

export function BreadcrumbList({
	children,
	className,
	...props
}: BreadcrumbListProps) {
	return (
		<ol
			className={clsx(
				"flex flex-wrap items-center gap-2 text-sm text-[color:var(--twc-muted)]",
				className,
			)}
			{...props}
		>
			{children}
		</ol>
	);
}

export function BreadcrumbItem({
	children,
	className,
	...props
}: BreadcrumbItemProps) {
	return (
		<li
			className={clsx("inline-flex items-center gap-2", className)}
			{...props}
		>
			{children}
		</li>
	);
}

export function BreadcrumbLink({
	children,
	className,
	...props
}: BreadcrumbLinkProps) {
	return (
		<a
			className={clsx(
				"transition hover:text-[color:var(--twc-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand)] focus-visible:ring-offset-2",
				className,
			)}
			{...props}
		>
			{children}
		</a>
	);
}

export function BreadcrumbCurrent({
	children,
	className,
	...props
}: BreadcrumbCurrentProps) {
	return (
		<span
			aria-current="page"
			className={clsx("ty-sm-semibold text-[color:var(--twc-text)]", className)}
			{...props}
		>
			{children}
		</span>
	);
}

export function BreadcrumbSeparator({
	children,
	className,
	...props
}: BreadcrumbSeparatorProps) {
	return (
		<span
			aria-hidden="true"
			className={clsx(
				"inline-flex items-center text-[color:var(--twc-muted)]",
				className,
			)}
			{...props}
		>
			{children ?? (
				<Icon
					icon={ChevronRight}
					className="h-4 w-4"
				/>
			)}
		</span>
	);
}
