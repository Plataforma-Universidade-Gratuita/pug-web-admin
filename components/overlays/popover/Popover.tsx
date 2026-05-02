"use client";

import { createContext, useContext, useMemo, useRef } from "react";

import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";

import type {
	PopoverContentProps,
	PopoverProps,
	PopoverTriggerProps,
} from "@/types/client";

type PopoverContextValue = {
	triggerRef: React.RefObject<HTMLSpanElement | null>;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function Popover({
	children,
	open,
	defaultOpen,
	onOpenChange,
	modal,
}: PopoverProps) {
	const triggerRef = useRef<HTMLSpanElement | null>(null);
	const contextValue = useMemo(() => ({ triggerRef }), []);
	const rootProps: Record<string, unknown> = {};
	if (open !== undefined) rootProps.open = open;
	if (defaultOpen !== undefined) rootProps.defaultOpen = defaultOpen;
	if (onOpenChange !== undefined) rootProps.onOpenChange = onOpenChange;
	if (modal !== undefined) rootProps.modal = modal;
	return (
		<PopoverContext.Provider value={contextValue}>
			<RadixPopover.Root {...rootProps}>{children}</RadixPopover.Root>
		</PopoverContext.Provider>
	);
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
	const context = useContext(PopoverContext);

	return (
		<RadixPopover.Trigger asChild>
			<span
				ref={context?.triggerRef}
				className="inline-flex shrink-0"
			>
				{children}
			</span>
		</RadixPopover.Trigger>
	);
}

export function PopoverContent({
	children,
	className,
	side = "bottom",
	align = "center",
	sideOffset = 10,
	avoidCollisions = true,
	collisionPadding,
	collisionBoundary,
	withArrow = true,
	onCloseAutoFocus,
	onEscapeKeyDown,
}: PopoverContentProps) {
	const context = useContext(PopoverContext);
	const shellBoundary = context?.triggerRef.current?.closest(
		".navbar-content, .navbar-content-scroll-viewport, .login-page-content",
	);
	const resolvedCollisionBoundary =
		collisionBoundary ?? shellBoundary ?? undefined;
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

	if (resolvedCollisionBoundary !== undefined) {
		contentProps.collisionBoundary = resolvedCollisionBoundary;
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
