export function normalizeSize(value: string | number | undefined) {
	if (typeof value === "number") {
		return `${value}px`;
	}

	return value;
}
