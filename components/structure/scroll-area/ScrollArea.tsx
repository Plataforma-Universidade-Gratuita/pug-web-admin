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
			className={clsx("relative overflow-hidden", className)}
			{...props}
		>
			<RadixScrollArea.Viewport
				className={clsx("h-full w-full rounded-[inherit]", viewportClassName)}
			>
				{children}
			</RadixScrollArea.Viewport>
			<RadixScrollArea.Scrollbar
				orientation="vertical"
				className="flex w-2.5 touch-none p-0.5"
			>
				<RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-[color:var(--twc-border-2)]" />
			</RadixScrollArea.Scrollbar>
			<RadixScrollArea.Scrollbar
				orientation="horizontal"
				className="flex h-2.5 touch-none p-0.5"
			>
				<RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-[color:var(--twc-border-2)]" />
			</RadixScrollArea.Scrollbar>
			<RadixScrollArea.Corner className="bg-[color:var(--twc-border-2)]" />
		</RadixScrollArea.Root>
	);
}
