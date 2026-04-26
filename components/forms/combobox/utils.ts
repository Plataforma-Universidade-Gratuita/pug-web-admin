import type { ComboboxOption } from "@/types/client";

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
