"use client";

import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import clsx from "clsx";

import type { RadioGroupItemProps, RadioGroupProps } from "@/types/client";

export function RadioGroup({ children, className, ...props }: RadioGroupProps) {
	return (
		<RadixRadioGroup.Root
			className={clsx("space-y-3", className)}
			{...props}
		>
			{children}
		</RadixRadioGroup.Root>
	);
}

export function RadioGroupItem({
	label,
	description,
	className,
	disabled,
	...props
}: RadioGroupItemProps) {
	return (
		<label
			className={clsx(
				"flex items-start gap-3",
				disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
				className,
			)}
		>
			<RadixRadioGroup.Item
				disabled={disabled}
				className="border-default-2 surface-2 focus-ring mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
				{...props}
			>
				<RadixRadioGroup.Indicator className="inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--color-brand)]" />
			</RadixRadioGroup.Item>
			{label || description ? (
				<span className="min-w-0 space-y-1">
					{label ? <span className="ty-sm-semibold block">{label}</span> : null}
					{description ? (
						<span className="ty-helper block">{description}</span>
					) : null}
				</span>
			) : null}
		</label>
	);
}
