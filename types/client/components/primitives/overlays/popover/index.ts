import type { RefObject } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixPopover from "@radix-ui/react-popover";

export interface PopoverContextValue {
	triggerRef: RefObject<HTMLSpanElement | null>;
}

export interface PopoverProps {
	children: ReactNode;
	open?: boolean | undefined;
	defaultOpen?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
	modal?: boolean | undefined;
}

export interface PopoverTriggerProps {
	children: ReactNode;
	className?: string;
}

export interface PopoverContentProps {
	children: ReactNode;
	className?: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
	avoidCollisions?: boolean;
	withArrow?: boolean;
	collisionPadding?:
		| number
		| Partial<Record<"top" | "right" | "bottom" | "left", number>>;
	collisionBoundary?: ComponentPropsWithoutRef<
		typeof RadixPopover.Content
	>["collisionBoundary"];
	onCloseAutoFocus?: ComponentPropsWithoutRef<
		typeof RadixPopover.Content
	>["onCloseAutoFocus"];
	onEscapeKeyDown?: ComponentPropsWithoutRef<
		typeof RadixPopover.Content
	>["onEscapeKeyDown"];
}
