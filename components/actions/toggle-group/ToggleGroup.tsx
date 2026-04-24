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
				className={clsx("toggle-group-root", className)}
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
			className={clsx("toggle-group-root", className)}
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
			className={clsx("toggle-root", className)}
			{...props}
		>
			{children}
		</RadixToggleGroup.Item>
	);
}
