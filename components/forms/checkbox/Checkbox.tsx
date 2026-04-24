"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { Check } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import type { CheckboxProps } from "@/types/client";

export function Checkbox({
	label,
	description,
	className,
	disabled,
	...props
}: CheckboxProps) {
	return (
		<label
			className={clsx(
				"flex items-start gap-3",
				disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
				className,
			)}
		>
			<RadixCheckbox.Root
				disabled={disabled}
				className="border-default-2 surface-2 focus-ring mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.375rem] border data-[state=checked]:border-[color:var(--color-brand)] data-[state=checked]:bg-[color:var(--color-brand)]"
				{...props}
			>
				<RadixCheckbox.Indicator className="text-white">
					<Icon
						icon={Check}
						className="h-3.5 w-3.5"
					/>
				</RadixCheckbox.Indicator>
			</RadixCheckbox.Root>
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
