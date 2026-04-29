"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";

import type {
	PopoverContentProps,
	PopoverProps,
	PopoverTriggerProps,
} from "@/types/client";

export function Popover({
	children,
	open,
	defaultOpen,
	onOpenChange,
	modal,
}: PopoverProps) {
	// Only pass open/onOpenChange if they are defined, to avoid TS error with exactOptionalPropertyTypes
	const rootProps: Record<string, unknown> = {};
	if (open !== undefined) rootProps.open = open;
	if (defaultOpen !== undefined) rootProps.defaultOpen = defaultOpen;
	if (onOpenChange !== undefined) rootProps.onOpenChange = onOpenChange;
	if (modal !== undefined) rootProps.modal = modal;
	return <RadixPopover.Root {...rootProps}>{children}</RadixPopover.Root>;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
	return <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>;
}

export function PopoverContent({
	children,
	className,
	side = "bottom",
	align = "center",
	sideOffset = 10,
	avoidCollisions = true,
	collisionPadding,
	withArrow = true,
	onCloseAutoFocus,
	onEscapeKeyDown,
}: PopoverContentProps) {
	const contentProps: Record<string, unknown> = {
		side,
		align,
		sideOffset,
		avoidCollisions,
		onCloseAutoFocus,
		onEscapeKeyDown,
	};

	if (collisionPadding !== undefined) {
		contentProps.collisionPadding = collisionPadding;
	}

	return (
		<RadixPopover.Portal>
			<RadixPopover.Content
				className={clsx("popover-panel popover-content", className)}
				{...contentProps}
			>
				{children}
				{withArrow ? <RadixPopover.Arrow className="popover-arrow" /> : null}
			</RadixPopover.Content>
		</RadixPopover.Portal>
	);
}
