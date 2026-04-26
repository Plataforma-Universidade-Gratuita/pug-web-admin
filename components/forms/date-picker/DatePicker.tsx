"use client";

import {
	type ChangeEvent,
	forwardRef,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";

import clsx from "clsx";
import { format, isAfter, isBefore } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { CalendarDays, ChevronDown, Clock3 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/actions/button/Button";
import { Icon } from "@/components/display/icon/Icon";
import {
	buildDateWithTime,
	clampDateToBounds,
	formatDateTimeValue,
	getDayPickerDisabled,
	getScrollableAncestor,
	parseDateTimeValue,
	setRefValue,
} from "@/components/forms/date-picker/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/forms/select/Select";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/navigation/accordion/Accordion";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/overlays/popover/Popover";
import type { DatePickerProps } from "@/types/client";

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
	function DatePicker(
		{
			className,
			defaultValue,
			disabled,
			id,
			max,
			min,
			name,
			onChange,
			onValueChange,
			placeholder,
			required,
			value,
			...inputProps
		},
		ref,
	) {
		const generatedId = useId();
		const { t, i18n } = useTranslation();
		const isControlled = value !== undefined;
		const hiddenInputRef = useRef<HTMLInputElement | null>(null);
		const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
		const [internalValue, setInternalValue] = useState(defaultValue ?? "");
		const [open, setOpen] = useState(false);
		const [activePanel, setActivePanel] = useState("date");
		const [month, setMonth] = useState<Date>(new Date());

		const fieldId = id ?? generatedId;
		const locale = i18n.resolvedLanguage === "en-US" ? enUS : ptBR;
		const minDate = useMemo(
			() => parseDateTimeValue(typeof min === "string" ? min : undefined),
			[min],
		);
		const maxDate = useMemo(
			() => parseDateTimeValue(typeof max === "string" ? max : undefined),
			[max],
		);
		const rawValue = isControlled ? (value ?? "") : internalValue;
		const selectedDate = useMemo(() => {
			const parsed = parseDateTimeValue(rawValue);
			if (!parsed) return undefined;
			return clampDateToBounds(parsed, minDate, maxDate);
		}, [maxDate, minDate, rawValue]);
		const safeValue = selectedDate ? formatDateTimeValue(selectedDate) : "";
		const displayValue = selectedDate
			? format(selectedDate, "PPp", { locale })
			: "";
		const displayPlaceholder =
			placeholder ?? t("components.datePicker.placeholder");
		const selectedHours = selectedDate?.getHours();
		const selectedMinutes = selectedDate?.getMinutes();
		const disabledDays = useMemo(
			() => getDayPickerDisabled(minDate, maxDate),
			[maxDate, minDate],
		);

		useEffect(() => {
			setRefValue(ref, hiddenInputRef.current);
		}, [ref]);

		useEffect(() => {
			if (!isControlled && rawValue !== safeValue) {
				setInternalValue(safeValue);
			}
		}, [isControlled, rawValue, safeValue]);

		useEffect(() => {
			if (selectedDate) {
				setMonth(selectedDate);
				return;
			}

			if (minDate) {
				setMonth(minDate);
				return;
			}

			setMonth(new Date());
		}, [minDate, selectedDate]);

		useEffect(() => {
			if (!open) return;

			let frameOne = 0;
			let frameTwo = 0;

			frameOne = requestAnimationFrame(() => {
				frameTwo = requestAnimationFrame(() => {
					const panel =
						document.querySelector<HTMLElement>(".date-picker-panel");
					if (!panel || !triggerButtonRef.current) return;

					const scrollContainer = getScrollableAncestor(
						triggerButtonRef.current,
					);
					const panelRect = panel.getBoundingClientRect();
					const containerBottom = scrollContainer
						? scrollContainer.getBoundingClientRect().bottom
						: window.innerHeight;
					const overflow = panelRect.bottom - (containerBottom - 12);

					if (overflow <= 0) return;

					if (scrollContainer) {
						scrollContainer.scrollBy({
							top: overflow + 12,
							behavior: "smooth",
						});
						return;
					}

					window.scrollBy({
						top: overflow + 12,
						behavior: "smooth",
					});
				});
			});

			return () => {
				cancelAnimationFrame(frameOne);
				cancelAnimationFrame(frameTwo);
			};
		}, [activePanel, open]);

		function emitValue(nextValue: string) {
			if (!isControlled) {
				setInternalValue(nextValue);
			}

			if (hiddenInputRef.current) {
				hiddenInputRef.current.value = nextValue;
			}

			onValueChange?.(nextValue);

			if (onChange && hiddenInputRef.current) {
				onChange({
					target: hiddenInputRef.current,
					currentTarget: hiddenInputRef.current,
				} as ChangeEvent<HTMLInputElement>);
			}
		}

		function commitDate(nextDate?: Date) {
			emitValue(nextDate ? formatDateTimeValue(nextDate) : "");
		}

		function handleDaySelect(nextDay?: Date) {
			if (!nextDay) return;
			const nextDate = buildDateWithTime(
				nextDay,
				selectedDate,
				minDate,
				maxDate,
			);
			commitDate(nextDate);
			setMonth(nextDay);
			setActivePanel("time");
		}

		function updateTime(part: "hours" | "minutes", nextValue: string) {
			if (!selectedDate) return;
			const numericValue = Number(nextValue);
			if (Number.isNaN(numericValue)) return;

			const nextDate = new Date(selectedDate);
			if (part === "hours") {
				nextDate.setHours(numericValue);
			} else {
				nextDate.setMinutes(numericValue);
			}
			nextDate.setSeconds(0, 0);
			commitDate(clampDateToBounds(nextDate, minDate, maxDate));
		}

		const hourOptions = Array.from({ length: 24 }, (_, index) => {
			const optionDate = selectedDate
				? new Date(
						selectedDate.getFullYear(),
						selectedDate.getMonth(),
						selectedDate.getDate(),
						index,
						selectedMinutes ?? 0,
						0,
						0,
					)
				: undefined;
			const optionDisabled =
				!optionDate ||
				(minDate && isBefore(optionDate, minDate)) ||
				(maxDate && isAfter(optionDate, maxDate));

			return {
				value: index.toString(),
				label: index.toString().padStart(2, "0"),
				disabled: optionDisabled,
			};
		});

		const minuteOptions = Array.from({ length: 60 }, (_, index) => {
			const optionDate = selectedDate
				? new Date(
						selectedDate.getFullYear(),
						selectedDate.getMonth(),
						selectedDate.getDate(),
						selectedHours ?? 0,
						index,
						0,
						0,
					)
				: undefined;
			const optionDisabled =
				!optionDate ||
				(minDate && isBefore(optionDate, minDate)) ||
				(maxDate && isAfter(optionDate, maxDate));

			return {
				value: index.toString(),
				label: index.toString().padStart(2, "0"),
				disabled: optionDisabled,
			};
		});

		return (
			<div className={clsx("date-picker-shell", className)}>
				<Popover
					open={open}
					onOpenChange={nextOpen => {
						setOpen(nextOpen);
						if (nextOpen) {
							setActivePanel("date");
						}
					}}
				>
					<PopoverTrigger>
						<button
							ref={triggerButtonRef}
							id={fieldId}
							type="button"
							disabled={disabled}
							className="field-shell date-picker-trigger"
							data-disabled={disabled ? "true" : "false"}
							aria-haspopup="dialog"
							aria-expanded={open}
							aria-label={displayValue || t("components.datePicker.openPicker")}
						>
							<span className="field-leading-icon">
								<Icon
									icon={CalendarDays}
									className="h-4 w-4"
								/>
							</span>
							<span
								className={clsx(
									"date-picker-value",
									!displayValue && "date-picker-placeholder",
								)}
							>
								{displayValue || displayPlaceholder}
							</span>
							<span className="date-picker-adornment">
								<Icon
									icon={Clock3}
									className="h-4 w-4"
								/>
								<Icon
									icon={ChevronDown}
									className="h-4 w-4"
								/>
							</span>
						</button>
					</PopoverTrigger>

					<PopoverContent
						align="start"
						side="bottom"
						avoidCollisions={false}
						className="date-picker-panel"
					>
						<Accordion
							type="single"
							value={activePanel}
							onValueChange={nextValue => {
								if (nextValue) {
									setActivePanel(nextValue);
								}
							}}
							className="date-picker-accordion"
						>
							<AccordionItem
								value="date"
								className="date-picker-accordion-item"
							>
								<AccordionTrigger className="date-picker-accordion-trigger">
									{t("components.datePicker.dateSection")}
								</AccordionTrigger>
								<AccordionContent className="date-picker-accordion-content">
									<DayPicker
										mode="single"
										month={month}
										onMonthChange={setMonth}
										selected={selectedDate}
										onSelect={handleDaySelect}
										disabled={disabledDays}
										locale={locale}
										labels={{
											labelNav: () =>
												t("components.datePicker.monthNavigation"),
											labelNext: () => t("components.datePicker.nextMonth"),
											labelPrevious: () =>
												t("components.datePicker.previousMonth"),
										}}
										aria-label={t("components.datePicker.calendarLabel")}
										classNames={{
											root: "date-picker-calendar",
											months: "date-picker-months",
											month: "date-picker-month",
											month_caption: "date-picker-month-caption",
											caption_label: "date-picker-caption-label",
											nav: "date-picker-nav",
											button_previous: "date-picker-nav-button",
											button_next: "date-picker-nav-button",
											month_grid: "date-picker-grid",
											weekdays: "date-picker-weekdays",
											weekday: "date-picker-weekday",
											week: "date-picker-week",
											day: "date-picker-day-cell",
											day_button: "date-picker-day-button",
											chevron: "date-picker-chevron",
										}}
										modifiersClassNames={{
											selected: "date-picker-day-selected",
											today: "date-picker-day-today",
											outside: "date-picker-day-outside",
											disabled: "date-picker-day-disabled",
										}}
									/>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem
								value="time"
								className="date-picker-accordion-item"
							>
								<AccordionTrigger className="date-picker-accordion-trigger">
									{t("components.datePicker.timeSection")}
								</AccordionTrigger>
								<AccordionContent className="date-picker-accordion-content">
									<div className="date-picker-time-section">
										<div className="date-picker-time-field">
											<label
												htmlFor={`${fieldId}-hours`}
												className="date-picker-time-label"
											>
												{t("components.datePicker.hours")}
											</label>
											<Select
												disabled={disabled || !selectedDate}
												value={selectedHours?.toString() ?? ""}
												onValueChange={nextValue =>
													updateTime("hours", nextValue)
												}
											>
												<SelectTrigger
													id={`${fieldId}-hours`}
													className="date-picker-time-trigger"
													placeholder={t("components.datePicker.hours")}
												/>
												<SelectContent className="date-picker-time-content">
													{hourOptions.map(option => (
														<SelectItem
															key={option.value}
															value={option.value}
															disabled={option.disabled ?? false}
														>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className="date-picker-time-field">
											<label
												htmlFor={`${fieldId}-minutes`}
												className="date-picker-time-label"
											>
												{t("components.datePicker.minutes")}
											</label>
											<Select
												disabled={disabled || !selectedDate}
												value={selectedMinutes?.toString() ?? ""}
												onValueChange={nextValue =>
													updateTime("minutes", nextValue)
												}
											>
												<SelectTrigger
													id={`${fieldId}-minutes`}
													className="date-picker-time-trigger"
													placeholder={t("components.datePicker.minutes")}
												/>
												<SelectContent className="date-picker-time-content">
													{minuteOptions.map(option => (
														<SelectItem
															key={option.value}
															value={option.value}
															disabled={option.disabled ?? false}
														>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>

						<div className="date-picker-footer">
							<Button
								usage="secondary"
								variant="ghost"
								size="sm"
								disabled={disabled || !selectedDate || required}
								onClick={() => commitDate(undefined)}
							>
								{t("components.datePicker.clear")}
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				<input
					{...inputProps}
					ref={hiddenInputRef}
					type="hidden"
					id={`${fieldId}-value`}
					name={name}
					value={safeValue}
					disabled={disabled}
					required={required}
					readOnly
				/>
			</div>
		);
	},
);
