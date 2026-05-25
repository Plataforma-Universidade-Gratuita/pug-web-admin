"use client";

import { useMemo, useRef, useState } from "react";

import clsx from "clsx";
import { ChevronDown, Search, X } from "lucide-react";

import { Icon } from "@/components";
import { Popover, PopoverContent, PopoverTrigger } from "@/components";
import {
	getComboboxSelectedLabel,
	getSearchableComboboxText,
} from "@/components/forms/combobox/utils";
import type { ComboboxProps } from "@/types";
import { normalizeTextForSearch } from "@/utils";

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
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const selectedValue = value ?? internalValue;

	const selectedOption = options.find(option => option.value === selectedValue);
	const filteredOptions = useMemo(() => {
		const normalizedQuery = normalizeTextForSearch(query.trim());
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

	function handleOptionsWheel(event: React.WheelEvent<HTMLDivElement>) {
		const scrollElement = scrollRef.current;

		if (
			!scrollElement ||
			scrollElement.scrollHeight <= scrollElement.clientHeight
		) {
			return;
		}

		const canScrollUp = event.deltaY < 0 && scrollElement.scrollTop > 0;
		const canScrollDown =
			event.deltaY > 0 &&
			scrollElement.scrollTop <
				scrollElement.scrollHeight - scrollElement.clientHeight;

		if (!canScrollUp && !canScrollDown) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		scrollElement.scrollTop += event.deltaY;
	}

	return (
		<Popover
			open={open}
			onOpenChange={nextOpen => {
				if (disabled) {
					setOpen(false);
					return;
				}

				setOpen(nextOpen);
				if (!nextOpen) setQuery("");
			}}
		>
			<div className="combobox-trigger-shell">
				<PopoverTrigger className="w-full">
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
				className={clsx(
					"combobox-content",
					disabled && "combobox-content-disabled",
				)}
			>
				<div className="combobox-panel-inner">
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
							disabled={disabled}
							className="combobox-search-input"
						/>
					</div>

					<div
						ref={scrollRef}
						className="combobox-scroll"
						onWheel={handleOptionsWheel}
					>
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
												disabled || option.disabled
													? "combobox-option-disabled"
													: null,
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
