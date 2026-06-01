"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import clsx from "clsx";

import type { SwitchProps } from "@/types";

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
				"control-root control-root-between",
				disabled ? "control-disabled" : "control-enabled",
				className,
			)}
		>
			{label || description ? (
				<span className="control-copy">
					{label ? <span className="control-label">{label}</span> : null}
					{description ? (
						<span className="control-description">{description}</span>
					) : null}
				</span>
			) : null}
			<RadixSwitch.Root
				disabled={disabled}
				className="switch-track focus-ring"
				{...props}
			>
				<RadixSwitch.Thumb className="switch-thumb" />
			</RadixSwitch.Root>
		</label>
	);
}
