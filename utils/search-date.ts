import type { SearchDateBoundary } from "@/types/client";

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
