"use client";

import clsx from "clsx";
import { X } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import type { BadgeProps, BadgeTone, BadgeVariant } from "@/types/client";

const BADGE_STYLES: Record<BadgeVariant, Record<BadgeTone, string>> = {
	soft: {
		neutral: "badge-tone-neutral badge-variant-soft",
		brand: "badge-tone-brand badge-variant-soft",
		success: "badge-tone-success badge-variant-soft",
		info: "badge-tone-info badge-variant-soft",
		warning: "badge-tone-warning badge-variant-soft",
		danger: "badge-tone-danger badge-variant-soft",
	},
	solid: {
		neutral: "badge-tone-neutral badge-variant-solid",
		brand: "badge-tone-brand badge-variant-solid",
		success: "badge-tone-success badge-variant-solid",
		info: "badge-tone-info badge-variant-solid",
		warning: "badge-tone-warning badge-variant-solid",
		danger: "badge-tone-danger badge-variant-solid",
	},
	outline: {
		neutral: "badge-tone-neutral badge-variant-outline",
		brand: "badge-tone-brand badge-variant-outline",
		success: "badge-tone-success badge-variant-outline",
		info: "badge-tone-info badge-variant-outline",
		warning: "badge-tone-warning badge-variant-outline",
		danger: "badge-tone-danger badge-variant-outline",
	},
};

export function Badge({
	children,
	className,
	tone = "neutral",
	variant = "soft",
	onRemove,
	removeLabel = "Remove badge",
	...props
}: BadgeProps) {
	return (
		<span
			className={clsx(
				"badge-base inline-flex min-h-6 items-center justify-center border px-2.5 py-1 text-center whitespace-nowrap",
				BADGE_STYLES[variant][tone],
				className,
			)}
			{...props}
		>
			{onRemove ? (
				<button
					type="button"
					onClick={event => {
						event.preventDefault();
						event.stopPropagation();
						onRemove();
					}}
					className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-current/75 transition hover:bg-black/8 hover:text-current"
					aria-label={removeLabel}
				>
					<Icon
						icon={X}
						className="h-3 w-3"
					/>
				</button>
			) : null}
			{children}
		</span>
	);
}
