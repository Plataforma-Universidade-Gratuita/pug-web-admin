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
			className={clsx("breadcrumb-list", className)}
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
			className={clsx("breadcrumb-item", className)}
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
			className={clsx("breadcrumb-link", className)}
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
			className={clsx("breadcrumb-current", className)}
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
			className={clsx("breadcrumb-separator", className)}
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
