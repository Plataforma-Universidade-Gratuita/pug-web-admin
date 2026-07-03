"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { ToggleGroup, ToggleGroupItem } from "@/components/primitives";
import { Icon } from "@/components/primitives";
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
