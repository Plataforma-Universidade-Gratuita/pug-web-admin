"use client";

import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import clsx from "clsx";

import type { RadioGroupItemProps, RadioGroupProps } from "@/types/client";

export function RadioGroup({ children, className, ...props }: RadioGroupProps) {
	return (
		<RadixRadioGroup.Root
			className={clsx("radio-group-root", className)}
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
				"control-root",
				disabled ? "control-disabled" : "control-enabled",
				className,
			)}
		>
			<RadixRadioGroup.Item
				disabled={disabled}
				className="radio-item focus-ring"
				{...props}
			>
				<RadixRadioGroup.Indicator className="radio-indicator" />
			</RadixRadioGroup.Item>
			{label || description ? (
				<span className="control-copy">
					{label ? <span className="control-label">{label}</span> : null}
					{description ? (
						<span className="control-description">{description}</span>
					) : null}
				</span>
			) : null}
		</label>
	);
}
