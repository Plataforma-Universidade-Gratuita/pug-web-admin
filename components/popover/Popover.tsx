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
}: PopoverContentProps) {
	return (
		<RadixPopover.Portal>
			<RadixPopover.Content
				side={side}
				align={align}
				sideOffset={sideOffset}
				className={clsx(
					"border-default-2 surface-2 shadow-strong z-[var(--twc-z-overlay)] w-[min(24rem,calc(100vw-2rem))] rounded-[var(--twc-radius-xl)] border p-4",
					className,
				)}
			>
				{children}
				<RadixPopover.Arrow className="fill-[color:var(--twc-surface-2)]" />
			</RadixPopover.Content>
		</RadixPopover.Portal>
	);
}
