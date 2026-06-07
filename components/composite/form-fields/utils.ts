import { normalizeDigits } from "@/schemas/client";

export function formatCpfValue(value: string) {
	const digits = normalizeDigits(value).slice(0, 11);

	if (digits.length <= 3) {
		return digits;
	}

	if (digits.length <= 6) {
		return `${digits.slice(0, 3)}.${digits.slice(3)}`;
	}

	if (digits.length <= 9) {
		return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
	}

	return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function normalizeCpfFieldQuery(value: string) {
	const trimmedValue = value.trimStart();
	const firstCharacter = trimmedValue.charAt(0);

	if (!firstCharacter) {
		return "";
	}

	return /\d/.test(firstCharacter) ? formatCpfValue(trimmedValue) : value;
}
