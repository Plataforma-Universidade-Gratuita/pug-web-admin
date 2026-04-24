"use client";

import * as RadixSeparator from "@radix-ui/react-separator";
import clsx from "clsx";

import type { SeparatorProps } from "@/types/client";

export function Separator({
	orientation = "horizontal",
	decorative = true,
	className,
	...props
}: SeparatorProps) {
	return (
		<RadixSeparator.Root
			orientation={orientation}
			decorative={decorative}
			className={clsx(
				"shrink-0 bg-[color:var(--twc-border-2)]",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className,
			)}
			{...props}
		/>
	);
}
