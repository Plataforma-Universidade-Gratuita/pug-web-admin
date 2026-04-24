"use client";

import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import clsx from "clsx";

import type { ToggleGroupItemProps, ToggleGroupProps } from "@/types/client";

export function ToggleGroup(props: ToggleGroupProps) {
	if (props.type === "multiple") {
		const { children, className, type, ...multipleProps } = props;

		return (
			<RadixToggleGroup.Root
				type={type}
				className={clsx("inline-flex flex-wrap gap-2", className)}
				{...multipleProps}
			>
				{children}
			</RadixToggleGroup.Root>
		);
	}

	const { children, className, type, ...singleProps } = props;

	return (
		<RadixToggleGroup.Root
			type={type ?? "single"}
			className={clsx("inline-flex flex-wrap gap-2", className)}
			{...singleProps}
		>
			{children}
		</RadixToggleGroup.Root>
	);
}

export function ToggleGroupItem({
	children,
	className,
	...props
}: ToggleGroupItemProps) {
	return (
		<RadixToggleGroup.Item
			className={clsx(
				"border-default-2 surface-2 focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-[var(--twc-radius-lg)] border px-3 py-2 text-sm font-medium transition-colors hover:bg-[color:var(--twc-surface-1)] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-[color:var(--color-brand)] data-[state=on]:bg-[color:color-mix(in_srgb,var(--color-brand)_14%,var(--twc-surface-2))] data-[state=on]:hover:bg-[color:color-mix(in_srgb,var(--color-brand)_18%,var(--twc-surface-2))]",
				className,
			)}
			{...props}
		>
			{children}
		</RadixToggleGroup.Item>
	);
}
