"use client";

import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

import { Icon } from "@/components";
import type {
	DropdownMenuContentProps,
	DropdownMenuItemProps,
	DropdownMenuLabelProps,
	DropdownMenuProps,
	DropdownMenuSeparatorProps,
	DropdownMenuTriggerProps,
} from "@/types";

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
	onCloseAutoFocus,
	...props
}: DropdownMenuContentProps) {
	return (
		<RadixDropdownMenu.Portal>
			<RadixDropdownMenu.Content
				align={align}
				sideOffset={sideOffset}
				className={clsx("dropdown-content", className)}
				onCloseAutoFocus={event => {
					onCloseAutoFocus?.(event);
					event.preventDefault();
				}}
				{...props}
			>
				{children}
			</RadixDropdownMenu.Content>
		</RadixDropdownMenu.Portal>
	);
}

function DropdownMenuBaseItem({
	className,
	current = false,
	icon,
	inset = false,
	label,
	tone = "default",
	onClick,
	onSelect,
	...props
}: DropdownMenuItemProps) {
	return (
		<RadixDropdownMenu.Item
			className={clsx(
				"dropdown-item focus-ring",
				current && "dropdown-item-current",
				inset ? "dropdown-item-inset" : null,
				tone !== "default" && `dropdown-item-tone-${tone}`,
				className,
			)}
			onSelect={event => {
				window.setTimeout(() => {
					if (onSelect) {
						onSelect(event);
						return;
					}

					onClick?.(event as never);
				}, 0);
			}}
			{...props}
		>
			<Icon
				icon={icon}
				className="h-4 w-4"
			/>
			<span className="ty-sm-semibold">{label}</span>
		</RadixDropdownMenu.Item>
	);
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
	return <DropdownMenuBaseItem {...props} />;
}

export function DropdownMenuPrimaryItem(props: DropdownMenuItemProps) {
	return (
		<DropdownMenuBaseItem
			tone="brand"
			{...props}
		/>
	);
}

export function DropdownMenuSuccessItem(props: DropdownMenuItemProps) {
	return (
		<DropdownMenuBaseItem
			tone="success"
			{...props}
		/>
	);
}

export function DropdownMenuInfoItem(props: DropdownMenuItemProps) {
	return (
		<DropdownMenuBaseItem
			tone="info"
			{...props}
		/>
	);
}

export function DropdownMenuWarningItem(props: DropdownMenuItemProps) {
	return (
		<DropdownMenuBaseItem
			tone="warning"
			{...props}
		/>
	);
}

export function DropdownMenuDangerItem(props: DropdownMenuItemProps) {
	return (
		<DropdownMenuBaseItem
			tone="danger"
			{...props}
		/>
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
