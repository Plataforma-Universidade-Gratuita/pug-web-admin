"use client";

import * as RadixToggle from "@radix-ui/react-toggle";
import clsx from "clsx";

import type { ToggleProps } from "@/types/client";

export function Toggle({ children, className, ...props }: ToggleProps) {
	return (
		<RadixToggle.Root
			className={clsx("toggle-root", className)}
			{...props}
		>
			{children}
		</RadixToggle.Root>
	);
}
