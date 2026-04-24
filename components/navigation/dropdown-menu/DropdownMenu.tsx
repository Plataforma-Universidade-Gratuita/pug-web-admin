"use client";

import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

import type {
	DropdownMenuContentProps,
	DropdownMenuItemProps,
	DropdownMenuLabelProps,
	DropdownMenuProps,
	DropdownMenuSeparatorProps,
	DropdownMenuTriggerProps,
} from "@/types/client";

export function DropdownMenu({
	children,
	open,
	onOpenChange,
}: DropdownMenuProps) {
	const rootProps: Partial<{
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}> = {};

	if (open !== undefined) rootProps.open = open;
	if (onOpenChange !== undefined) rootProps.onOpenChange = onOpenChange;

	return (
		<RadixDropdownMenu.Root {...rootProps}>{children}</RadixDropdownMenu.Root>
	);
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
	return (
		<RadixDropdownMenu.Trigger asChild>{children}</RadixDropdownMenu.Trigger>
	);
}

export function DropdownMenuContent({
	children,
	className,
	align = "end",
	sideOffset = 8,
	...props
}: DropdownMenuContentProps) {
	return (
		<RadixDropdownMenu.Portal>
			<RadixDropdownMenu.Content
				align={align}
				sideOffset={sideOffset}
				className={clsx("dropdown-content", className)}
				{...props}
			>
				{children}
			</RadixDropdownMenu.Content>
		</RadixDropdownMenu.Portal>
	);
}

export function DropdownMenuItem({
	children,
	className,
	inset = false,
	...props
}: DropdownMenuItemProps) {
	return (
		<RadixDropdownMenu.Item
			className={clsx(
				"dropdown-item focus-ring",
				inset ? "dropdown-item-inset" : null,
				className,
			)}
			{...props}
		>
			{children}
		</RadixDropdownMenu.Item>
	);
}

export function DropdownMenuLabel({
	children,
	className,
	inset = false,
	...props
}: DropdownMenuLabelProps) {
	return (
		<RadixDropdownMenu.Label
			className={clsx(
				"dropdown-label",
				inset ? "dropdown-label-inset" : null,
				className,
			)}
			{...props}
		>
			{children}
		</RadixDropdownMenu.Label>
	);
}

export function DropdownMenuSeparator({
	className,
	...props
}: DropdownMenuSeparatorProps) {
	return (
		<RadixDropdownMenu.Separator
			className={clsx("dropdown-separator", className)}
			{...props}
		/>
	);
}
