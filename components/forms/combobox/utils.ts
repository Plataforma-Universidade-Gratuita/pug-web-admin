import type { ComboboxOption } from "@/types";
import { normalizeTextForSearch } from "@/utils";

export function getSearchableComboboxText(option: ComboboxOption) {
	return normalizeTextForSearch(
		[
			option.value,
			typeof option.label === "string" ? option.label : "",
			option.searchText ?? "",
			...(option.keywords ?? []),
		].join(" "),
	);
}

export function getComboboxSelectedLabel(option: ComboboxOption | undefined) {
	if (!option) return undefined;
	return typeof option.label === "string" ? option.label : option.value;
}
