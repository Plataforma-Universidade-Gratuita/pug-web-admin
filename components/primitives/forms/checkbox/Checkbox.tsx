"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { Check } from "lucide-react";

import { Icon } from "@/components/primitives";
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
				"control-root control-root-inline",
				disabled ? "control-disabled" : "control-enabled",
				className,
			)}
		>
			<RadixCheckbox.Root
				disabled={disabled}
				className="checkbox-box focus-ring"
				{...props}
			>
				<RadixCheckbox.Indicator className="checkbox-indicator">
					<Icon
						icon={Check}
						className="h-3.5 w-3.5"
					/>
				</RadixCheckbox.Indicator>
			</RadixCheckbox.Root>
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
