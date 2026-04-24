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
				className={clsx(
					"border-default-2 surface-2 shadow-strong z-50 min-w-52 overflow-hidden rounded-[var(--twc-radius-xl)] border p-1",
					"data-[state=closed]:animate-[accordion-up_var(--twc-duration-fast)_var(--twc-ease-standard)] data-[state=open]:animate-[accordion-down_var(--twc-duration-fast)_var(--twc-ease-standard)]",
					className,
				)}
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
				"focus-ring relative flex cursor-default items-center gap-3 rounded-[var(--twc-radius-lg)] px-3 py-2 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:text-[color:var(--twc-muted)] data-[highlighted]:bg-[color:var(--twc-surface-1)]",
				inset ? "pl-8" : null,
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
				"ty-sm-semibold px-3 py-2 text-[color:var(--twc-muted)]",
				inset ? "pl-8" : null,
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
			className={clsx("border-default-2 my-1 h-px border-t", className)}
			{...props}
		/>
	);
}
