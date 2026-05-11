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
import { CalendarDays, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/actions/button/Button";
import { Icon } from "@/components/display/icon/Icon";
import {
	clampDateToBounds,
	formatDateTimeValue,
	getDayPickerDisabled,
	getScrollableAncestor,
	normalizeDatePickerValue,
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
			panelAlign = "start",
			panelAvoidCollisions,
			panelCollisionPadding,
			panelSide = "bottom",
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
			? format(selectedDate, "PP", { locale })
			: "";
		const displayPlaceholder =
			placeholder ?? t("components.datePicker.placeholder");
		const disabledDays = useMemo(
			() => getDayPickerDisabled(minDate, maxDate),
			[maxDate, minDate],
		);
		const monthOptions = useMemo(
			() =>
				Array.from({ length: 12 }, (_, monthIndex) => ({
					value: String(monthIndex),
					label: format(new Date(2026, monthIndex, 1), "LLLL", { locale }),
				})),
			[locale],
		);
		const yearOptions = useMemo(() => {
			const baseMonth = selectedDate ?? minDate ?? new Date();
			const today = new Date();
			const fallbackStart =
				Math.min(baseMonth.getFullYear(), today.getFullYear()) - 12;
			const fallbackEnd =
				Math.max(baseMonth.getFullYear(), today.getFullYear()) + 12;
			const startYear = minDate?.getFullYear() ?? fallbackStart;
			const endYear = maxDate?.getFullYear() ?? fallbackEnd;
			return Array.from(
				{ length: Math.max(endYear - startYear + 1, 1) },
				(_, index) => String(startYear + index),
			);
		}, [maxDate, minDate, selectedDate]);

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
		}, [open]);

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
			const nextDate = normalizeDatePickerValue(nextDay, minDate, maxDate);
			commitDate(nextDate);
			setMonth(nextDay);
			setOpen(false);
		}

		function updateMonth(nextMonthIndex: string) {
			const parsedMonth = Number(nextMonthIndex);
			if (Number.isNaN(parsedMonth)) return;
			const nextMonth = new Date(month.getFullYear(), parsedMonth, 1);
			setMonth(nextMonth);
		}

		function updateYear(nextYearValue: string) {
			const parsedYear = Number(nextYearValue);
			if (Number.isNaN(parsedYear)) return;
			const nextMonth = new Date(parsedYear, month.getMonth(), 1);
			setMonth(nextMonth);
		}

		function jumpToToday() {
			const today = normalizeDatePickerValue(new Date(), minDate, maxDate);
			if (
				(minDate && isBefore(today, minDate)) ||
				(maxDate && isAfter(today, maxDate))
			) {
				return;
			}
			commitDate(today);
			setMonth(today);
			setOpen(false);
		}

		return (
			<div className={clsx("date-picker-shell", className)}>
				<Popover
					open={open}
					onOpenChange={setOpen}
				>
					<PopoverTrigger className="w-full">
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
									icon={ChevronDown}
									className="h-4 w-4"
								/>
							</span>
						</button>
					</PopoverTrigger>

					<PopoverContent
						align={panelAlign}
						side={panelSide}
						avoidCollisions={panelAvoidCollisions ?? panelSide !== "bottom"}
						{...(panelCollisionPadding !== undefined
							? { collisionPadding: panelCollisionPadding }
							: {})}
						className="date-picker-panel"
					>
						<div className="date-picker-header-controls">
							<Select
								value={String(month.getMonth())}
								onValueChange={updateMonth}
								{...(disabled !== undefined ? { disabled } : {})}
							>
								<SelectTrigger
									className="date-picker-select-trigger"
									placeholder={monthOptions[month.getMonth()]?.label}
								/>
								<SelectContent>
									{monthOptions.map(option => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={String(month.getFullYear())}
								onValueChange={updateYear}
								{...(disabled !== undefined ? { disabled } : {})}
							>
								<SelectTrigger
									className="date-picker-year-trigger"
									placeholder={String(month.getFullYear())}
								/>
								<SelectContent>
									{yearOptions.map(option => (
										<SelectItem
											key={option}
											value={option}
										>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="date-picker-calendar-shell">
							<DayPicker
								mode="single"
								month={month}
								onMonthChange={setMonth}
								selected={selectedDate}
								onSelect={handleDaySelect}
								disabled={disabledDays}
								locale={locale}
								fixedWeeks
								showOutsideDays
								labels={{
									labelNav: () => t("components.datePicker.monthNavigation"),
									labelNext: () => t("components.datePicker.nextMonth"),
									labelPrevious: () => t("components.datePicker.previousMonth"),
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
						</div>

						<div className="date-picker-footer">
							<Button
								usage="secondary"
								variant="secondary"
								size="sm"
								disabled={disabled || !selectedDate || required}
								onClick={() => commitDate(undefined)}
							>
								{t("components.datePicker.clear")}
							</Button>
							<Button
								usage="primary"
								variant="secondary"
								size="sm"
								disabled={disabled}
								onClick={jumpToToday}
							>
								{t("components.datePicker.today")}
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
