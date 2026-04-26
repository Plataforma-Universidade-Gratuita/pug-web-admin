"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";

import type {
	PopoverContentProps,
	PopoverProps,
	PopoverTriggerProps,
} from "@/types/client";

export function Popover({ children, open, onOpenChange }: PopoverProps) {
	// Only pass open/onOpenChange if they are defined, to avoid TS error with exactOptionalPropertyTypes
	const rootProps: Record<string, unknown> = {};
	if (open !== undefined) rootProps.open = open;
	if (onOpenChange !== undefined) rootProps.onOpenChange = onOpenChange;
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
}: PopoverContentProps) {
	const contentProps: Record<string, unknown> = {
		side,
		align,
		sideOffset,
		avoidCollisions,
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
				<RadixPopover.Arrow className="popover-arrow" />
			</RadixPopover.Content>
		</RadixPopover.Portal>
	);
}
