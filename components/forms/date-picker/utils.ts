import type { Ref } from "react";

import { format, isAfter, isBefore, startOfDay } from "date-fns";

import { DATE_ONLY_VALUE, DATE_TIME_VALUE } from "@/constants";

const DATE_ONLY_VALUE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_VALUE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export function parseDateTimeValue(value?: string): Date | undefined {
	if (!value) return undefined;

	if (DATE_ONLY_VALUE.test(value)) {
		const dateSegments = value.split("-").map(Number);
		if (dateSegments.length !== 3) return undefined;
		const year = dateSegments[0];
		const month = dateSegments[1];
		const day = dateSegments[2];
		if (year === undefined || month === undefined || day === undefined) {
			return undefined;
		}
		const result = new Date(year, month - 1, day, 0, 0, 0, 0);
		return Number.isNaN(result.getTime()) ? undefined : result;
	}

	if (DATE_TIME_VALUE.test(value)) {
		const parts = value.split("T");
		if (parts.length !== 2) return undefined;
		const datePart = parts[0];
		const timePart = parts[1];
		if (!datePart || !timePart) return undefined;
		const dateSegments = datePart.split("-").map(Number);
		const timeSegments = timePart.split(":").map(Number);
		if (dateSegments.length !== 3 || timeSegments.length !== 2) {
			return undefined;
		}
		const year = dateSegments[0];
		const month = dateSegments[1];
		const day = dateSegments[2];
		const hours = timeSegments[0];
		const minutes = timeSegments[1];
		if (
			year === undefined ||
			month === undefined ||
			day === undefined ||
			hours === undefined ||
			minutes === undefined
		) {
			return undefined;
		}
		const result = new Date(year, month - 1, day, hours, minutes, 0, 0);
		return Number.isNaN(result.getTime()) ? undefined : result;
	}

	return undefined;
}

export function formatDateTimeValue(date: Date): string {
	return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function clampDateToBounds(
	date: Date,
	minDate?: Date,
	maxDate?: Date,
): Date {
	if (minDate && isBefore(date, minDate)) return minDate;
	if (maxDate && isAfter(date, maxDate)) return maxDate;
	return date;
}

export function normalizeDatePickerValue(
	day: Date,
	minDate?: Date,
	maxDate?: Date,
): Date {
	return clampDateToBounds(
		new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0),
		minDate ? startOfDay(minDate) : undefined,
		maxDate ? startOfDay(maxDate) : undefined,
	);
}

export function getDayPickerDisabled(minDate?: Date, maxDate?: Date) {
	if (minDate && maxDate) {
		return {
			before: startOfDay(minDate),
			after: startOfDay(maxDate),
		};
	}

	if (minDate) {
		return { before: startOfDay(minDate) };
	}

	if (maxDate) {
		return { after: startOfDay(maxDate) };
	}

	return undefined;
}

export function setRefValue<T>(ref: Ref<T> | undefined, value: T | null) {
	if (!ref) return;
	if (typeof ref === "function") {
		ref(value);
		return;
	}
	ref.current = value;
}

export function getScrollableAncestor(
	node: HTMLElement | null,
): HTMLElement | null {
	let current = node?.parentElement ?? null;

	while (current) {
		const { overflowY } = window.getComputedStyle(current);
		const canScroll =
			(overflowY === "auto" || overflowY === "scroll") &&
			current.scrollHeight > current.clientHeight;

		if (canScroll) {
			return current;
		}

		current = current.parentElement;
	}

	return null;
}
