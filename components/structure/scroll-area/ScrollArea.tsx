"use client";

import * as RadixScrollArea from "@radix-ui/react-scroll-area";
import clsx from "clsx";

import type { ScrollAreaProps } from "@/types/client";

export function ScrollArea({
	children,
	className,
	viewportClassName,
	...props
}: ScrollAreaProps) {
	return (
		<RadixScrollArea.Root
			className={clsx("scroll-area-root", className)}
			{...props}
		>
			<RadixScrollArea.Viewport
				className={clsx("scroll-area-viewport", viewportClassName)}
			>
				{children}
			</RadixScrollArea.Viewport>
			<RadixScrollArea.Scrollbar
				orientation="vertical"
				className="scroll-area-scrollbar-vertical"
			>
				<RadixScrollArea.Thumb className="scroll-area-thumb" />
			</RadixScrollArea.Scrollbar>
			<RadixScrollArea.Scrollbar
				orientation="horizontal"
				className="scroll-area-scrollbar-horizontal"
			>
				<RadixScrollArea.Thumb className="scroll-area-thumb" />
			</RadixScrollArea.Scrollbar>
			<RadixScrollArea.Corner className="scroll-area-corner" />
		</RadixScrollArea.Root>
	);
}
