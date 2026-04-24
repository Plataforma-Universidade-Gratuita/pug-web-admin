"use client";

import * as RadixLabel from "@radix-ui/react-label";
import clsx from "clsx";

import type { LabelProps } from "@/types/client";

export function Label({ children, className, ...props }: LabelProps) {
	return (
		<RadixLabel.Root
			className={clsx("ty-sm-semibold", className)}
			{...props}
		>
			{children}
		</RadixLabel.Root>
	);
}
