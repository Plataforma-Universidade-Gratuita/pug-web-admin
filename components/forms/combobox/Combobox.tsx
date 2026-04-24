"use client";

import { useMemo, useState } from "react";

import clsx from "clsx";
import { Check, ChevronDown, Search } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/overlays/popover/Popover";
import type { ComboboxOption, ComboboxProps } from "@/types/client";

function getSearchableText(option: ComboboxOption) {
	return [
		option.value,
		typeof option.label === "string" ? option.label : "",
		option.searchText ?? "",
		...(option.keywords ?? []),
	]
		.join(" ")
		.toLowerCase();
}

function getSelectedLabel(option: ComboboxOption | undefined) {
	if (!option) return undefined;
	return typeof option.label === "string" ? option.label : option.value;
}

export function Combobox({
	options,
	id,
	value,
	defaultValue,
	onValueChange,
	placeholder = "Select an option",
	searchPlaceholder = "Search options",
	emptyMessage = "No options found.",
	disabled = false,
	className,
}: ComboboxProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [internalValue, setInternalValue] = useState(defaultValue);
	const selectedValue = value ?? internalValue;

	const selectedOption = options.find(option => option.value === selectedValue);
	const filteredOptions = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return options;

		return options.filter(option =>
			getSearchableText(option).includes(normalizedQuery),
		);
	}, [options, query]);

	function handleValueChange(nextValue: string) {
		if (value === undefined) setInternalValue(nextValue);
		onValueChange?.(nextValue);
		setOpen(false);
		setQuery("");
	}

	return (
		<Popover
			open={open}
			onOpenChange={nextOpen => {
				setOpen(nextOpen);
				if (!nextOpen) setQuery("");
			}}
		>
			<PopoverTrigger>
				<button
					id={id}
					type="button"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className={clsx(
						"border-default-2 surface-2 focus-ring inline-flex h-10 w-full items-center justify-between gap-3 rounded-[var(--twc-radius-lg)] border px-3 py-2 text-left transition disabled:pointer-events-none disabled:opacity-60",
						className,
					)}
				>
					<span
						className={clsx(
							"min-w-0 flex-1 truncate",
							selectedOption
								? "text-[color:var(--twc-text)]"
								: "text-[color:var(--twc-muted)]",
						)}
					>
						{selectedOption ? getSelectedLabel(selectedOption) : placeholder}
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
				<div className="space-y-2">
					<label
						className="sr-only"
						htmlFor={id ? `${id}-search` : undefined}
					>
						{searchPlaceholder}
					</label>
					<div className="border-default-2 surface-2 flex items-center rounded-[var(--twc-radius-lg)] border px-3">
						<span className="shrink-0 text-[color:var(--twc-muted)]">
							<Icon
								icon={Search}
								className="h-4 w-4"
							/>
						</span>
						<input
							id={id ? `${id}-search` : undefined}
							type="text"
							value={query}
							onChange={event => setQuery(event.target.value)}
							placeholder={searchPlaceholder}
							className="w-full bg-transparent px-3 py-2.5 text-base text-[color:var(--twc-text)] outline-none placeholder:text-[color:var(--twc-muted)]"
						/>
					</div>

					<div className="max-h-72 overflow-y-auto">
						{filteredOptions.length === 0 ? (
							<div className="px-3 py-6 text-center text-sm text-[color:var(--twc-muted)]">
								{emptyMessage}
							</div>
						) : (
							<div className="space-y-1">
								{filteredOptions.map(option => {
									const isSelected = option.value === selectedValue;

									return (
										<button
											key={option.value}
											type="button"
											onClick={() => handleValueChange(option.value)}
											disabled={disabled || option.disabled}
											className={clsx(
												"focus-ring flex w-full items-start justify-between gap-3 rounded-[var(--twc-radius-lg)] px-3 py-2 text-left transition outline-none",
												option.disabled
													? "cursor-not-allowed opacity-50"
													: "hover:bg-[color:var(--twc-surface-1)]",
											)}
										>
											<span className="min-w-0 flex-1">
												<span className="ty-sm-semibold block">
													{option.label}
												</span>
												{option.description ? (
													<span className="ty-helper block">
														{option.description}
													</span>
												) : null}
											</span>
											<span className="shrink-0 text-[color:var(--color-brand)]">
												{isSelected ? (
													<Icon
														icon={Check}
														className="h-4 w-4"
													/>
												) : null}
											</span>
										</button>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
