"use client";

import { useMemo, useState } from "react";

import clsx from "clsx";
import { ChevronDown, Search, X } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import {
	getComboboxSelectedLabel,
	getSearchableComboboxText,
} from "@/components/forms/combobox/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/overlays/popover/Popover";
import type { ComboboxProps } from "@/types/client";

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
			getSearchableComboboxText(option).includes(normalizedQuery),
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
			<div className="combobox-trigger-shell">
				<PopoverTrigger>
					<button
						id={id}
						type="button"
						role="combobox"
						aria-controls="combobox-trigger-shell"
						aria-expanded={open}
						disabled={disabled}
						className={clsx("combobox-trigger", className)}
					>
						<span
							className={clsx(
								"min-w-0 flex-1 truncate",
								selectedOption
									? "text-[color:var(--twc-text)]"
									: "text-[color:var(--twc-muted)]",
							)}
						>
							{selectedOption
								? getComboboxSelectedLabel(selectedOption)
								: placeholder}
						</span>
					</button>
				</PopoverTrigger>
				<div className="select-adornment">
					{selectedOption ? (
						<button
							type="button"
							disabled={disabled}
							onClick={event => {
								event.preventDefault();
								event.stopPropagation();
								handleValueChange("");
							}}
							className="field-icon-button select-clear-button"
							aria-label="Clear selection"
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

			<PopoverContent
				align="start"
				className="combobox-content"
			>
				<div className="space-y-2">
					<label
						className="sr-only"
						htmlFor={id ? `${id}-search` : undefined}
					>
						{searchPlaceholder}
					</label>
					<div className="combobox-search-shell">
						<span className="combobox-search-icon">
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
							className="combobox-search-input"
						/>
					</div>

					<div className="combobox-scroll">
						{filteredOptions.length === 0 ? (
							<div className="combobox-empty">{emptyMessage}</div>
						) : (
							<div className="combobox-options">
								{filteredOptions.map(option => {
									const isSelected = option.value === selectedValue;

									return (
										<button
											key={option.value}
											type="button"
											onClick={() => handleValueChange(option.value)}
											disabled={disabled || option.disabled}
											className={clsx(
												"focus-ring combobox-option",
												isSelected ? "combobox-option-selected" : null,
												option.disabled ? "combobox-option-disabled" : null,
											)}
										>
											<span className="combobox-option-indicator">
												<span
													aria-hidden="true"
													className="combobox-option-indicator-bar"
												/>
											</span>
											<span className="combobox-option-copy">
												<span
													className={clsx(
														"combobox-option-label",
														isSelected
															? "combobox-option-label-selected"
															: null,
													)}
												>
													{option.label}
												</span>
												{option.description ? (
													<span className="control-description">
														{option.description}
													</span>
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
