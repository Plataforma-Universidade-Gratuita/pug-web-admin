"use client";

import clsx from "clsx";

import type { BadgeProps, BadgeTone, BadgeVariant } from "@/types/client";

const BADGE_STYLES: Record<BadgeVariant, Record<BadgeTone, string>> = {
	soft: {
		neutral:
			"border-[color:var(--twc-border-2)] bg-[color:var(--twc-surface-1)] text-[color:var(--twc-text)]",
		brand:
			"border-[color:color-mix(in_srgb,var(--color-brand)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-brand)_14%,var(--twc-surface-2))] text-[color:var(--color-brand)]",
		success:
			"border-[color:color-mix(in_srgb,var(--color-success)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-success)_14%,var(--twc-surface-2))] text-[color:var(--color-success)]",
		info: "border-[color:color-mix(in_srgb,var(--color-info)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-info)_14%,var(--twc-surface-2))] text-[color:var(--color-info)]",
		warning:
			"border-[color:color-mix(in_srgb,var(--color-warning)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-warning)_16%,var(--twc-surface-2))] text-[color:var(--color-warning)]",
		danger:
			"border-[color:color-mix(in_srgb,var(--color-danger)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--color-danger)_14%,var(--twc-surface-2))] text-[color:var(--color-danger)]",
	},
	solid: {
		neutral:
			"border-[color:var(--twc-text)] bg-[color:var(--twc-text)] text-[color:var(--twc-surface-2)]",
		brand:
			"border-[color:var(--color-brand)] bg-[color:var(--color-brand)] text-white",
		success:
			"border-[color:var(--color-success)] bg-[color:var(--color-success)] text-white",
		info: "border-[color:var(--color-info)] bg-[color:var(--color-info)] text-white",
		warning:
			"border-[color:var(--color-warning)] bg-[color:var(--color-warning)] text-black",
		danger:
			"border-[color:var(--color-danger)] bg-[color:var(--color-danger)] text-white",
	},
	outline: {
		neutral:
			"border-[color:var(--twc-border-2)] bg-transparent text-[color:var(--twc-text)]",
		brand:
			"border-[color:var(--color-brand)] bg-transparent text-[color:var(--color-brand)]",
		success:
			"border-[color:var(--color-success)] bg-transparent text-[color:var(--color-success)]",
		info: "border-[color:var(--color-info)] bg-transparent text-[color:var(--color-info)]",
		warning:
			"border-[color:var(--color-warning)] bg-transparent text-[color:var(--color-warning)]",
		danger:
			"border-[color:var(--color-danger)] bg-transparent text-[color:var(--color-danger)]",
	},
};

export function Badge({
	children,
	className,
	tone = "neutral",
	variant = "soft",
	...props
}: BadgeProps) {
	return (
		<span
			className={clsx(
				"ty-sm-semibold inline-flex min-h-6 items-center justify-center rounded-full border px-2.5 py-1 text-center leading-none whitespace-nowrap",
				BADGE_STYLES[variant][tone],
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
