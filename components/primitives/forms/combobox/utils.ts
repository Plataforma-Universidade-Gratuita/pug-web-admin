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

export function buildVisibleSelections<TSelection>(
    selectedOptions: TSelection[],
    maxVisibleValues: number,
) {
    const visibleOptions = selectedOptions.slice(0, maxVisibleValues);
    const remainingCount = selectedOptions.length - visibleOptions.length;

    return { visibleOptions, remainingCount };
}