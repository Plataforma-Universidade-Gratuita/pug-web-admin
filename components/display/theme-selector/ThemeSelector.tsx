"use client";

import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/actions/toggle-group/ToggleGroup";
import { Icon } from "@/components/display/icon/Icon";
import type { AppTheme, ThemeSelectorProps } from "@/types/client";

export function ThemeSelector({
	className,
	colorVariant = "default",
	onValueChange,
	options,
	value,
}: ThemeSelectorProps) {
	return (
		<ToggleGroup
			type="single"
			variant="pill"
			colorVariant={colorVariant}
			value={value}
			onValueChange={nextValue => {
				if (nextValue) {
					onValueChange(nextValue as AppTheme);
				}
			}}
			className={className}
		>
			{options.map(option => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					aria-label={option.label}
					tooltipContent={option.label}
				>
					<Icon
						icon={option.icon}
						size={16}
					/>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
