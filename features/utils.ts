import type { SearchDateBoundary } from "@/types/client";

export function appendCopyToText(value: string) {
	return `${value} Copy`;
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
