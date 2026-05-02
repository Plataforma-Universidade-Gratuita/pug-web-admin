"use client";

import clsx from "clsx";
import { X } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import { BADGE_STYLES } from "@/constants/components";
import type { BadgeProps } from "@/types/client";

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
				"badge-base inline-flex min-h-6 items-center justify-center gap-1 border px-2.5 py-1 text-center whitespace-nowrap",
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
					className="badge-remove-button"
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
