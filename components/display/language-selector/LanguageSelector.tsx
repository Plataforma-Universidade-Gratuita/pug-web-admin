"use client";

import clsx from "clsx";

import { Tooltip } from "@/components";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/actions/toggle-group/ToggleGroup";
import type { AppLang, LanguageSelectorProps } from "@/types/client";

export function LanguageSelector({
	className,
	onValueChange,
	options,
	value,
}: LanguageSelectorProps) {
	return (
		<ToggleGroup
			type="single"
			value={value ?? options[0]?.value}
			onValueChange={nextValue => {
				if (nextValue) {
					onValueChange(nextValue as AppLang);
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
						title={option.label}
						className="selector-pill-item selector-pill-item-label"
					>
						{option.shortLabel}
					</ToggleGroupItem>
				</Tooltip>
			))}
		</ToggleGroup>
	);
}
