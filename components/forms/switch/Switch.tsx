"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import clsx from "clsx";

import type { SwitchProps } from "@/types/client";

export function Switch({
	label,
	description,
	className,
	disabled,
	...props
}: SwitchProps) {
	return (
		<label
			className={clsx(
				"flex items-start justify-between gap-4",
				disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
				className,
			)}
		>
			{label || description ? (
				<span className="min-w-0 space-y-1">
					{label ? <span className="ty-sm-semibold block">{label}</span> : null}
					{description ? (
						<span className="ty-helper block">{description}</span>
					) : null}
				</span>
			) : null}
			<RadixSwitch.Root
				disabled={disabled}
				className="border-default-2 focus-ring surface-1 relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors hover:bg-[color:var(--twc-surface-2)] disabled:pointer-events-none data-[state=checked]:bg-[color:var(--color-brand)] data-[state=checked]:hover:bg-[color:color-mix(in_srgb,var(--color-brand)_88%,black)]"
				{...props}
			>
				<RadixSwitch.Thumb className="surface-2 shadow-normal pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full transition-transform data-[state=checked]:translate-x-[1.3rem]" />
			</RadixSwitch.Root>
		</label>
	);
}
