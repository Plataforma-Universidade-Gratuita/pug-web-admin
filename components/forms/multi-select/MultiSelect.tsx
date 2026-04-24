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
import type { MultiSelectProps } from "@/types/client";

function buildVisibleSelections({
	selectedOptions,
	maxVisibleValues,
}: {
	selectedOptions: Array<{ value: string; label: string }>;
	maxVisibleValues: number;
}) {
	const visibleOptions = selectedOptions.slice(0, maxVisibleValues);
	const remainingCount = selectedOptions.length - visibleOptions.length;

	return { visibleOptions, remainingCount };
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

	const { visibleOptions, remainingCount } = buildVisibleSelections({
		selectedOptions,
		maxVisibleValues,
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

	function clearAll() {
		updateValue([]);
	}

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<div className="relative w-full">
				<PopoverTrigger>
					<button
						id={id}
						type="button"
						disabled={disabled}
						className={clsx(
							"border-default-2 surface-2 focus-ring inline-flex min-h-10 w-full items-center rounded-[var(--twc-radius-lg)] border px-3 py-2 pr-18 text-left transition disabled:pointer-events-none disabled:opacity-60",
							className,
						)}
					>
						<span className="sr-only">Open multi-select options</span>
					</button>
				</PopoverTrigger>

				<div className="pointer-events-none absolute inset-0 flex items-center justify-between gap-3 px-3 py-2 pr-18">
					<div className="pointer-events-auto min-w-0 flex-1">
						{selectedOptions.length > 0 ? (
							<div className="flex flex-wrap items-center gap-2">
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
							<span className="text-[color:var(--twc-muted)]">
								{placeholder}
							</span>
						)}
					</div>

					<div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2">
						{selectedOptions.length > 0 ? (
							<button
								type="button"
								disabled={disabled}
								onClick={event => {
									event.preventDefault();
									event.stopPropagation();
									clearAll();
								}}
								className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--twc-muted)] transition hover:bg-[color:var(--twc-surface-1)] hover:text-[color:var(--twc-text)] disabled:pointer-events-none"
								aria-label="Clear all selections"
							>
								<Icon
									icon={X}
									className="h-3.5 w-3.5"
								/>
							</button>
						) : null}

						<span className="text-[color:var(--twc-muted)]">
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
