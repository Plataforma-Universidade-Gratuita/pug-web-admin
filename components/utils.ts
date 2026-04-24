import { Children, isValidElement, type ReactNode } from "react";

import type { ExternalToast } from "sonner";

import type { AppToastOptions, ComboboxOption } from "@/types/client";

export function getAccessibleText(node: ReactNode): string | undefined {
	const text = Children.toArray(node)
		.map(child => {
			if (typeof child === "string" || typeof child === "number") {
				return String(child);
			}

			if (isValidElement<{ children?: ReactNode }>(child)) {
				return getAccessibleText(child.props.children);
			}

			return "";
		})
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();

	return text || undefined;
}

export function normalizeSize(value: string | number | undefined) {
	if (typeof value === "number") {
		return `${value}px`;
	}

	return value;
}

export function getSearchableComboboxText(option: ComboboxOption) {
	return [
		option.value,
		typeof option.label === "string" ? option.label : "",
		option.searchText ?? "",
		...(option.keywords ?? []),
	]
		.join(" ")
		.toLowerCase();
}

export function getComboboxSelectedLabel(option: ComboboxOption | undefined) {
	if (!option) return undefined;
	return typeof option.label === "string" ? option.label : option.value;
}

export function buildVisibleSelections<TSelection>(
	selectedOptions: TSelection[],
	maxVisibleValues: number,
) {
	const visibleOptions = selectedOptions.slice(0, maxVisibleValues);
	const remainingCount = selectedOptions.length - visibleOptions.length;

	return { visibleOptions, remainingCount };
}

export function withToastDefaults(
	options: AppToastOptions | undefined,
	duration: number,
): ExternalToast {
	return {
		duration,
		...options,
	};
}

export function resolveToastValue<TData>(
	value: ReactNode | ((data: TData) => ReactNode),
	data: TData,
) {
	return typeof value === "function"
		? (value as (data: TData) => ReactNode)(data)
		: value;
}
