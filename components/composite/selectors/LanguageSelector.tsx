"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/primitives";
import type { AppLang, LanguageSelectorProps } from "@/types/client";

export function LanguageSelector({
	className,
	colorVariant = "default",
	onValueChange,
	options,
	value,
}: LanguageSelectorProps) {
	return (
		<ToggleGroup
			type="single"
			variant="pill"
			colorVariant={colorVariant}
			value={value ?? options[0]?.value}
			onValueChange={nextValue => {
				if (nextValue) {
					onValueChange(nextValue as AppLang);
				}
			}}
			className={className}
		>
			{options.map(option => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					aria-label={option.label}
					title={option.label}
					className="toggle-group-item-short-label"
					tooltipContent={option.label}
				>
					{option.shortLabel}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
