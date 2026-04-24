"use client";

import { useMemo, useState } from "react";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/forms/checkbox/Checkbox";
import { Icon } from "@/components/display/icon/Icon";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/overlays/popover/Popover";
import type { MultiSelectProps } from "@/types/client";

function buildDisplayValue({
	selectedLabels,
	maxVisibleValues,
	placeholder,
}: {
	selectedLabels: string[];
	maxVisibleValues: number;
	placeholder?: MultiSelectProps["placeholder"];
}) {
	if (selectedLabels.length === 0) return placeholder;

	const visibleLabels = selectedLabels.slice(0, maxVisibleValues);
	const remainingCount = selectedLabels.length - visibleLabels.length;
	const label = visibleLabels.join(", ");

	return remainingCount > 0 ? `${label} +${remainingCount}` : label;
}

export function MultiSelect({
	options,
	id,
	value,
	defaultValue,
	onValueChange,
	placeholder,
	disabled = false,
	className,
	maxVisibleValues = 2,
}: MultiSelectProps) {
	const [open, setOpen] = useState(false);
	const [internalValue, setInternalValue] = useState(defaultValue ?? []);
	const selectedValues = value ?? internalValue;

	const selectedLabels = useMemo(
		() =>
			options
				.filter(option => selectedValues.includes(option.value))
				.map(option =>
					typeof option.label === "string" ? option.label : option.value,
				),
		[options, selectedValues],
	);

	const displayValue = buildDisplayValue({
		selectedLabels,
		maxVisibleValues,
		placeholder,
	});

	function updateValue(nextValue: string[]) {
		if (value === undefined) setInternalValue(nextValue);
		onValueChange?.(nextValue);
	}

	function toggleValue(optionValue: string) {
		const nextValue = selectedValues.includes(optionValue)
			? selectedValues.filter(valueItem => valueItem !== optionValue)
			: [...selectedValues, optionValue];

		updateValue(nextValue);
	}

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger>
				<button
					id={id}
					type="button"
					disabled={disabled}
					className={clsx(
						"border-default-2 surface-2 focus-ring inline-flex h-10 w-full items-center justify-between gap-3 rounded-[var(--twc-radius-lg)] border px-3 py-2 text-left transition disabled:pointer-events-none disabled:opacity-60",
						className,
					)}
				>
					<span className="min-w-0 flex-1 truncate text-[color:var(--twc-text)]">
						{displayValue ? (
							displayValue
						) : (
							<span className="text-[color:var(--twc-muted)]">
								{placeholder}
							</span>
						)}
					</span>
					<span className="shrink-0 text-[color:var(--twc-muted)]">
						<Icon
							icon={ChevronDown}
							className="h-4 w-4"
						/>
					</span>
				</button>
			</PopoverTrigger>

			<PopoverContent
				align="start"
				className="w-[min(28rem,calc(100vw-2rem))] p-2"
			>
				<div className="space-y-1">
					{options.map(option => (
						<div
							key={option.value}
							className="rounded-[var(--twc-radius-lg)] px-2 py-1 hover:bg-[color:var(--twc-surface-1)]"
						>
							<Checkbox
								checked={selectedValues.includes(option.value)}
								onCheckedChange={() => toggleValue(option.value)}
								disabled={disabled || option.disabled}
								label={option.label}
								description={option.description}
							/>
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
