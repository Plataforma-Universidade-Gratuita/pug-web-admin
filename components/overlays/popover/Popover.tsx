"use client";

import type { CSSProperties } from "react";
import { createContext, useContext, useMemo, useRef } from "react";

import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";

import type {
	PopoverContentProps,
	PopoverProps,
	PopoverTriggerProps,
} from "@/types/client";
import {
	getFloatingLayerBoundary,
	usesAppTopbarCollisionPadding,
} from "@/utils/overlay";

const FLOATING_PANEL_VIEWPORT_PADDING = 16;
const APP_TOPBAR_COLLISION_PADDING = 76;

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

export function PopoverTrigger({ children, className }: PopoverTriggerProps) {
	const context = useContext(PopoverContext);

	return (
		<RadixPopover.Trigger asChild>
			<span
				ref={context?.triggerRef}
				className={clsx("block", className)}
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
	const shellBoundary = getFloatingLayerBoundary(
		context?.triggerRef.current ?? null,
	);
	const isAppShellPopover = usesAppTopbarCollisionPadding(shellBoundary);
	const resolvedCollisionBoundary =
		collisionBoundary ?? shellBoundary ?? undefined;
	const resolvedCollisionPadding = (() => {
		const basePadding = {
			top: isAppShellPopover
				? APP_TOPBAR_COLLISION_PADDING
				: FLOATING_PANEL_VIEWPORT_PADDING,
			right: FLOATING_PANEL_VIEWPORT_PADDING,
			bottom: FLOATING_PANEL_VIEWPORT_PADDING,
			left: FLOATING_PANEL_VIEWPORT_PADDING,
		};

		if (collisionPadding === undefined) {
			return basePadding;
		}

		if (typeof collisionPadding === "number") {
			return {
				top: Math.max(basePadding.top, collisionPadding),
				right: Math.max(basePadding.right, collisionPadding),
				bottom: Math.max(basePadding.bottom, collisionPadding),
				left: Math.max(basePadding.left, collisionPadding),
			};
		}

		return {
			top: Math.max(basePadding.top, collisionPadding.top ?? 0),
			right: Math.max(basePadding.right, collisionPadding.right ?? 0),
			bottom: Math.max(basePadding.bottom, collisionPadding.bottom ?? 0),
			left: Math.max(basePadding.left, collisionPadding.left ?? 0),
		};
	})();
	const contentProps: Record<string, unknown> = {
		side,
		align,
		sideOffset,
		avoidCollisions,
		onCloseAutoFocus,
		onEscapeKeyDown,
		collisionPadding: resolvedCollisionPadding,
	};

	if (resolvedCollisionBoundary !== undefined) {
		contentProps.collisionBoundary = resolvedCollisionBoundary;
	}

	return (
		<RadixPopover.Portal>
			<RadixPopover.Content
				className={clsx("popover-panel popover-content", className)}
				style={
					{
						"--popover-content-available-height":
							"var(--radix-popover-content-available-height)",
					} as CSSProperties
				}
				{...contentProps}
			>
				{children}
				{withArrow ? <RadixPopover.Arrow className="popover-arrow" /> : null}
			</RadixPopover.Content>
		</RadixPopover.Portal>
	);
}
