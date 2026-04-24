"use client";

import * as RadixToggle from "@radix-ui/react-toggle";
import clsx from "clsx";

import type { ToggleProps } from "@/types/client";

export function Toggle({ children, className, ...props }: ToggleProps) {
	return (
		<RadixToggle.Root
			className={clsx(
				"border-default-2 surface-2 focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-[var(--twc-radius-lg)] border px-3 py-2 text-sm font-medium transition-colors hover:bg-[color:var(--twc-surface-1)] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-[color:var(--color-brand)] data-[state=on]:bg-[color:color-mix(in_srgb,var(--color-brand)_14%,var(--twc-surface-2))] data-[state=on]:hover:bg-[color:color-mix(in_srgb,var(--color-brand)_18%,var(--twc-surface-2))]",
				className,
			)}
			{...props}
		>
			{children}
		</RadixToggle.Root>
	);
}
