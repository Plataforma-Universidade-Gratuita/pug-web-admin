"use client";

import { useMemo, useState } from "react";

import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";

import { Badge } from "@/components/display/badge/Badge";
import { Icon } from "@/components/display/icon/Icon";
import { Checkbox } from "@/components/forms/checkbox/Checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/overlays/popover/Popover";
import { buildVisibleSelections } from "@/components/utils";
import type { MultiSelectProps } from "@/types/client";

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

	const selectedOptions = useMemo(
		() =>
			options
				.filter(option => selectedValues.includes(option.value))
				.map(option => ({
					value: option.value,
					label: typeof option.label === "string" ? option.label : option.value,
				})),
		[options, selectedValues],
	);

	const { visibleOptions, remainingCount } = buildVisibleSelections(
		selectedOptions,
		maxVisibleValues,
	);

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

	function clearAll() {
		updateValue([]);
	}

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<div className="multi-select-shell">
				<PopoverTrigger>
					<button
						id={id}
						type="button"
						disabled={disabled}
						className={clsx("multi-select-trigger", className)}
					>
						<span className="sr-only">Open multi-select options</span>
					</button>
				</PopoverTrigger>

				<div className="multi-select-overlay">
					<div className="multi-select-values">
						{selectedOptions.length > 0 ? (
							<div className="multi-select-value-list">
								{visibleOptions.map(option => (
									<Badge
										key={option.value}
										tone="brand"
										variant="soft"
										onRemove={
											disabled ? undefined : () => toggleValue(option.value)
										}
										removeLabel={`Remove ${option.label}`}
										className="max-w-full"
									>
										<span className="truncate">{option.label}</span>
									</Badge>
								))}
								{remainingCount > 0 ? (
									<Badge
										tone="neutral"
										variant="outline"
									>
										+{remainingCount}
									</Badge>
								) : null}
							</div>
						) : (
							<span className="multi-select-placeholder">{placeholder}</span>
						)}
					</div>

					<div className="multi-select-adornment">
						{selectedOptions.length > 0 ? (
							<button
								type="button"
								disabled={disabled}
								onClick={event => {
									event.preventDefault();
									event.stopPropagation();
									clearAll();
								}}
								className="field-icon-button select-clear-button"
								aria-label="Clear all selections"
							>
								<Icon
									icon={X}
									className="h-3.5 w-3.5"
								/>
							</button>
						) : null}

						<span className="select-chevron">
							<Icon
								icon={ChevronDown}
								className="h-4 w-4"
							/>
						</span>
					</div>
				</div>
			</div>

			<PopoverContent
				align="start"
				className="multi-select-content"
			>
				<div className="multi-select-options">
					{options.map(option => (
						<div
							key={option.value}
							className="multi-select-option-row"
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
