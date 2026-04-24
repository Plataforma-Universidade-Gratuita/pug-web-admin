import clsx from "clsx";

import type {
	SectionActionsProps,
	SectionContentProps,
	SectionDescriptionProps,
	SectionHeaderProps,
	SectionProps,
	SectionTitleProps,
} from "@/types/client";

export function Section({ children, className, ...props }: SectionProps) {
	return (
		<section
			className={clsx("space-y-6", className)}
			{...props}
		>
			{children}
		</section>
	);
}

export function SectionHeader({
	children,
	className,
	...props
}: SectionHeaderProps) {
	return (
		<div
			className={clsx(
				"flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function SectionTitle({
	children,
	className,
	...props
}: SectionTitleProps) {
	return (
		<h2
			className={clsx("ty-header", className)}
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
	return (
		<p
			className={clsx("ty-helper", className)}
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
	return (
		<div
			className={clsx("space-y-6", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function SectionActions({
	children,
	className,
	...props
}: SectionActionsProps) {
	return (
		<div
			className={clsx("flex flex-wrap gap-3", className)}
			{...props}
		>
			{children}
		</div>
	);
}
