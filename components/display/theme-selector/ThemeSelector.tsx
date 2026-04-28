"use client";

import clsx from "clsx";

import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/actions/toggle-group/ToggleGroup";
import { Icon } from "@/components/display/icon/Icon";
import { Tooltip } from "@/components/overlays/tooltip/Tooltip";
import type { AppTheme, ThemeSelectorProps } from "@/types/client";

export function ThemeSelector({
	className,
	onValueChange,
	options,
	value,
}: ThemeSelectorProps) {
	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={nextValue => {
				if (nextValue) {
					onValueChange(nextValue as AppTheme);
				}
			}}
			className={clsx("selector-pill-root", className)}
		>
			{options.map(option => (
				<Tooltip
					key={option.value}
					content={option.label}
				>
					<ToggleGroupItem
						value={option.value}
						aria-label={option.label}
						className="selector-pill-item selector-pill-item"
					>
						<Icon
							icon={option.icon}
							size={16}
						/>
					</ToggleGroupItem>
				</Tooltip>
			))}
		</ToggleGroup>
	);
}
