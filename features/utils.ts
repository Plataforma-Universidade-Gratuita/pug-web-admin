import type { TFunction } from "i18next";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import type { SearchDateBoundary } from "@/types/client";
import {
	getApiErrorFieldErrors,
	getApiErrorToastContent,
	hasNestedFieldValue,
} from "@/utils";

type CrudFeedbackAction = "create" | "update" | "duplicate" | "delete";

export function appendCopyToText(value: string, existingValues: string[] = []) {
	const trimmedValue = value.trim();
	const match = trimmedValue.match(/^(.*?)( Copy(?:\d+)?)$/);
	const normalizedExistingValues = new Set(
		existingValues.map(currentValue => currentValue.trim().toLowerCase()),
	);

	if (!match) {
		const candidate = `${trimmedValue} Copy`;
		if (!normalizedExistingValues.has(candidate.toLowerCase())) {
			return candidate;
		}

		let nextNumber = 2;
		while (true) {
			const numberedCandidate = `${trimmedValue} Copy${nextNumber}`;
			if (!normalizedExistingValues.has(numberedCandidate.toLowerCase())) {
				return numberedCandidate;
			}
			nextNumber += 1;
		}
	}

	const baseValue = match[1]?.trimEnd() ?? trimmedValue;
	const currentSuffix = trimmedValue.slice(baseValue.length);
	let nextNumber =
		currentSuffix === " Copy"
			? 2
			: (Number(currentSuffix.slice(" Copy".length)) || 1) + 1;

	while (true) {
		const candidate = `${baseValue} Copy${nextNumber}`;
		if (!normalizedExistingValues.has(candidate.toLowerCase())) {
			return candidate;
		}
		nextNumber += 1;
	}
}

export function appendCopyToEmail(
	email: string,
	existingEmails: string[] = [],
) {
	const separatorIndex = email.indexOf("@");
	const localPart =
		separatorIndex === -1 ? email : email.slice(0, separatorIndex);
	const domainPart = separatorIndex === -1 ? "" : email.slice(separatorIndex);
	const match = localPart.match(/^(.*?)(Copy(?:\d+)?)$/);
	const normalizedExistingEmails = new Set(
		existingEmails.map(currentEmail => currentEmail.trim().toLowerCase()),
	);

	if (!match) {
		const candidate = `${localPart}Copy${domainPart}`;
		if (!normalizedExistingEmails.has(candidate.toLowerCase())) {
			return candidate;
		}

		let nextNumber = 2;
		while (true) {
			const numberedCandidate = `${localPart}Copy${nextNumber}${domainPart}`;
			if (!normalizedExistingEmails.has(numberedCandidate.toLowerCase())) {
				return numberedCandidate;
			}
			nextNumber += 1;
		}
	}

	const baseLocalPart = match[1] ?? localPart;
	const currentSuffix = localPart.slice(baseLocalPart.length);
	let nextNumber =
		currentSuffix === "Copy"
			? 2
			: (Number(currentSuffix.slice("Copy".length)) || 1) + 1;

	while (true) {
		const candidate = `${baseLocalPart}Copy${nextNumber}${domainPart}`;
		if (!normalizedExistingEmails.has(candidate.toLowerCase())) {
			return candidate;
		}
		nextNumber += 1;
	}
}

export function normalizeDigits(value: string) {
	return value.replace(/\D+/g, "");
}

export function getCrudErrorToastContent(
	t: TFunction,
	error: unknown,
	action: CrudFeedbackAction,
	object: string,
) {
	return getApiErrorToastContent(error, {
		fallbackTitle: t(`common.feedback.${action}.error.title`),
		fallbackDescription: t(`common.feedback.${action}.error.description`, {
			object,
		}),
	});
}

export function getCrudSuccessToastContent(
	t: TFunction,
	action: CrudFeedbackAction,
	name: string,
) {
	return {
		title: t(`common.feedback.${action}.success.title`),
		description: t(`common.feedback.${action}.success.description`, {
			name,
		}),
	};
}

export function getCrudDeleteConfirmCopy(
	t: TFunction,
	object: string,
	name: string,
) {
	return {
		title: t("common.feedback.delete.confirm.title", {
			object,
		}),
		description: t("common.feedback.delete.confirm.description", {
			name,
		}),
	};
}

export function getCrudDeleteUndoToastContent(t: TFunction, name: string) {
	return {
		title: t("common.feedback.delete.undo.title"),
		description: t("common.feedback.delete.undo.description", {
			name,
		}),
		undoLabel: t("common.feedback.delete.undo.action"),
	};
}

export function applyApiFieldErrors<TValues extends FieldValues>(
	form: UseFormReturn<TValues>,
	error: unknown,
): boolean {
	const fieldErrors = getApiErrorFieldErrors(error);
	const formValues = form.getValues();
	let hasAppliedErrors = false;

	for (const [field, messages] of Object.entries(fieldErrors)) {
		const message = messages.find(Boolean);
		if (!message || !hasNestedFieldValue(formValues, field)) {
			continue;
		}

		form.setError(field as FieldPath<TValues>, {
			type: "server",
			message,
		});
		hasAppliedErrors = true;
	}

	return hasAppliedErrors;
}

function setBoundaryHours(date: Date, boundary: SearchDateBoundary) {
	if (boundary === "start") {
		date.setHours(0, 0, 0, 0);
		return;
	}

	date.setHours(23, 59, 59, 999);
}

export function parseSearchDateTimestamp(value: string) {
	const timestamp = new Date(value).getTime();
	return Number.isNaN(timestamp) ? null : timestamp;
}

export function getSearchDateBoundaryTimestamp(
	value: string,
	boundary: SearchDateBoundary,
) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	setBoundaryHours(date, boundary);
	return date.getTime();
}

export function toSearchDateOffsetDateTime(
	value: string,
	boundary: SearchDateBoundary,
) {
	const timestamp = getSearchDateBoundaryTimestamp(value, boundary);

	if (timestamp === null) {
		return undefined;
	}

	return new Date(timestamp).toISOString();
}

export function matchesAnyDateRange(
	values: string[],
	range: {
		dateFrom?: string;
		dateTo?: string;
	},
) {
	const timestamps = values
		.map(parseSearchDateTimestamp)
		.filter((timestamp): timestamp is number => timestamp !== null);

	if (timestamps.length === 0) {
		return false;
	}

	const startTimestamp = range.dateFrom
		? parseSearchDateTimestamp(range.dateFrom)
		: null;
	const endTimestamp = range.dateTo
		? parseSearchDateTimestamp(range.dateTo)
		: null;

	if (
		startTimestamp !== null &&
		timestamps.every(timestamp => timestamp < startTimestamp)
	) {
		return false;
	}

	return !(
		endTimestamp !== null &&
		timestamps.every(timestamp => timestamp > endTimestamp)
	);
}
