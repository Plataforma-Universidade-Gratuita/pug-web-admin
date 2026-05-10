import type { ComboboxOption } from "@/types/client";
import { normalizeTextForSearch } from "@/utils/lang";

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
