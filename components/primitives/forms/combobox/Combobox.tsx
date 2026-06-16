"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";
import { ChevronDown, Search, X } from "lucide-react";

import { Badge, Icon, Tooltip } from "@/components/primitives";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/primitives";
import {
	getSearchableComboboxText,
	buildVisibleSelections,
	getComboboxSelectedLabel,
	getVisibleSelectionCount,
} from "@/components/primitives/forms/combobox/utils";
import type { ComboboxProps } from "@/types/client";
import { normalizeTextForSearch } from "@/utils";

export function Combobox({
	options,
	id,
	value,
	defaultValue,
	onValueChange,
	values,
	defaultValues,
	onValuesChange,
	multiple = false,
	placeholder = "Select an option",
	searchPlaceholder = "Search options",
	emptyMessage = "No options found.",
	creatable = false,
	createLabel,
	onCreateValue,
	queryNormalizer,
	canCreateValue,
	disabled = false,
	className,
	maxVisibleValues,
	selectionTone = "brand",
}: ComboboxProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [internalValues, setInternalValues] = useState(defaultValues ?? []);
	const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const measurementRef = useRef<HTMLDivElement | null>(null);
	const summaryMeasurementRef = useRef<HTMLSpanElement | null>(null);
	const selectedValue = value ?? internalValue;
	const selectedValues = values ?? internalValues;
	const [visibleSelectionCount, setVisibleSelectionCount] = useState(0);

	const selectedOption = options.find(option => option.value === selectedValue);
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
		visibleSelectionCount,
	);
	const hiddenOptions = selectedOptions.slice(visibleSelectionCount);
	const filteredOptions = useMemo(() => {
		const normalizedQuery = normalizeTextForSearch(query.trim());
		if (!normalizedQuery) return options;

		return options.filter(option =>
			getSearchableComboboxText(option).includes(normalizedQuery),
		);
	}, [options, query]);
	const creatableValue = query.trim();
	const canCreate =
		creatable &&
		creatableValue.length > 0 &&
		(canCreateValue
			? canCreateValue(creatableValue, options)
			: !options.some(option => option.value === creatableValue));

	useLayoutEffect(() => {
		if (!multiple) {
			return;
		}

		const triggerButtonElement = triggerButtonRef.current;
		const measurementElement = measurementRef.current;
		const summaryMeasurementElement = summaryMeasurementRef.current;

		if (
			!triggerButtonElement ||
			!measurementElement ||
			!summaryMeasurementElement
		) {
			return;
		}

		const measureVisibleCount = () => {
			if (selectedOptions.length === 0) {
				setVisibleSelectionCount(0);
				return;
			}

			if (selectedOptions.length === 1) {
				setVisibleSelectionCount(1);
				return;
			}

			const badgeWidths = Array.from(
				measurementElement.querySelectorAll<HTMLElement>(
					"[data-combobox-measure-badge='true']",
				),
			).map(node => node.offsetWidth);

			const measurementStyles = window.getComputedStyle(measurementElement);
			const gapValue =
				measurementStyles.columnGap || measurementStyles.gap || "0";
			const gap = Number.parseFloat(gapValue) || 0;
			const triggerStyles = window.getComputedStyle(triggerButtonElement);
			const paddingLeft =
				Number.parseFloat(triggerStyles.paddingLeft || "0") || 0;
			const paddingRight =
				Number.parseFloat(triggerStyles.paddingRight || "0") || 0;
			const nextVisibleCount = getVisibleSelectionCount({
				availableWidth:
					triggerButtonElement.clientWidth - paddingLeft - paddingRight,
				itemWidths: badgeWidths,
				gap,
				maxVisibleValues,
				getSummaryWidth: remainingCount => {
					summaryMeasurementElement.textContent = `+${remainingCount}`;
					return summaryMeasurementElement.parentElement instanceof HTMLElement
						? summaryMeasurementElement.parentElement.offsetWidth
						: summaryMeasurementElement.offsetWidth;
				},
			});

			setVisibleSelectionCount(
				nextVisibleCount === 0 ? 1 : nextVisibleCount,
			);
		};

		measureVisibleCount();

		if (typeof ResizeObserver === "undefined") {
			return;
		}

		const resizeObserver = new ResizeObserver(() => {
			measureVisibleCount();
		});

		resizeObserver.observe(triggerButtonElement);
		resizeObserver.observe(measurementElement);

		return () => {
			resizeObserver.disconnect();
		};
	}, [maxVisibleValues, multiple, selectedOptions]);

	function handleValueChange(nextValue: string) {
		if (value === undefined) setInternalValue(nextValue);
		onValueChange?.(nextValue);
		setOpen(false);
		setQuery("");
	}

	function handleCreateValue() {
		if (!canCreate) {
			return;
		}

		const createdValue = onCreateValue?.(creatableValue);
		handleValueChange(createdValue ?? creatableValue);
	}

	function handleValuesChange(nextValues: string[]) {
		if (values === undefined) {
			setInternalValues(nextValues);
		}

		onValuesChange?.(nextValues);
	}

	function toggleValue(optionValue: string) {
		if (!multiple) {
			handleValueChange(optionValue);
			return;
		}

		const nextValues = selectedValues.includes(optionValue)
			? selectedValues.filter(valueItem => valueItem !== optionValue)
			: [...selectedValues, optionValue];

		handleValuesChange(nextValues);
	}

	function handleOptionsWheel(event: React.WheelEvent<HTMLDivElement>) {
		const isInsideDrawer = triggerButtonRef.current?.closest(
			".drawer-content-base",
		);
		if (!isInsideDrawer) {
			return;
		}

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
						ref={triggerButtonRef}
						id={id}
						type="button"
						role="combobox"
						aria-controls="combobox-trigger-shell"
						aria-expanded={open}
						disabled={disabled}
						className={clsx("combobox-trigger", className)}
					>
						{multiple ? (
							<div
								className="flex w-0 min-w-0 flex-1 items-center gap-1 overflow-hidden"
							>
								{selectedOptions.length > 0 ? (
									<>
										<div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
											{visibleOptions.map((option, index) => (
												<Tooltip
													key={option.value}
													content={option.label}
												>
													<span className="min-w-0 flex-1 basis-0 overflow-hidden">
														<Badge
															tone={selectionTone}
															variant="primary"
															className={clsx(
																"min-h-5 min-w-0 max-w-full px-2 py-0.5",
																index === visibleOptions.length - 1
																	? "w-full"
																	: null,
															)}
														>
															<span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
																{option.label}
															</span>
														</Badge>
													</span>
												</Tooltip>
											))}
										</div>
										{remainingCount > 0 ? (
											<Tooltip
												content={
													<div className="grid gap-1">
														{hiddenOptions.map(option => (
															<span key={option.value}>{option.label}</span>
														))}
													</div>
												}
											>
												<span className="shrink-0">
													<Badge
														tone="neutral"
														variant="secondary"
														className="min-h-5 px-2 py-0.5"
													>
														+{remainingCount}
													</Badge>
												</span>
											</Tooltip>
										) : null}
									</>
								) : (
									<span className="text-[color:var(--twc-muted)]">
										{placeholder}
									</span>
								)}
							</div>
						) : (
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
									: selectedValue || placeholder}
							</span>
						)}
					</button>
				</PopoverTrigger>
				<div className="select-adornment">
					{(multiple ? selectedOptions.length > 0 : Boolean(selectedOption)) ? (
						<button
							type="button"
							disabled={disabled}
							onClick={event => {
								event.preventDefault();
								event.stopPropagation();
								if (multiple) {
									handleValuesChange([]);
									return;
								}

								handleValueChange("");
							}}
							className="field-icon-button select-clear-button"
							aria-label={multiple ? "Clear selections" : "Clear selection"}
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

			{multiple && selectedOptions.length > 0 ? (
				<div
					ref={measurementRef}
					aria-hidden="true"
					className="pointer-events-none absolute left-0 top-0 -z-10 flex gap-1 whitespace-nowrap"
					style={{ visibility: "hidden" }}
				>
					{selectedOptions.map(option => (
						<Badge
							key={option.value}
							tone={selectionTone}
							variant="primary"
							className="min-h-5 px-2 py-0.5"
							data-combobox-measure-badge="true"
						>
							<span className="whitespace-nowrap">{option.label}</span>
						</Badge>
					))}
					<Badge
						tone="neutral"
						variant="secondary"
						className="min-h-5 px-2 py-0.5"
					>
						<span ref={summaryMeasurementRef}>+0</span>
					</Badge>
				</div>
			) : null}

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
							onChange={event =>
								setQuery(
									queryNormalizer
										? queryNormalizer(event.target.value)
										: event.target.value,
								)
							}
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
						{canCreate ? (
							<div className="combobox-options">
								<button
									type="button"
									onClick={handleCreateValue}
									disabled={disabled}
									className="focus-ring combobox-option"
								>
									<span className="combobox-option-indicator">
										<span
											aria-hidden="true"
											className="combobox-option-indicator-bar"
										/>
									</span>
									<span className="combobox-option-copy">
										<span className="combobox-option-label">
											{createLabel
												? createLabel(creatableValue)
												: creatableValue}
										</span>
									</span>
								</button>
							</div>
						) : null}

						{filteredOptions.length === 0 && !canCreate ? (
							<div className="combobox-empty">{emptyMessage}</div>
						) : (
							<div className="combobox-options">
								{filteredOptions.map(option => {
									const isSelected = multiple
										? selectedValues.includes(option.value)
										: option.value === selectedValue;

									return (
										<button
											key={option.value}
											type="button"
											onClick={() => toggleValue(option.value)}
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
