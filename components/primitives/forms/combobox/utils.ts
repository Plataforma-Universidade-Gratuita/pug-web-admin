import type {ComboboxOption, VisibleSelectionCountInput} from "@/types/client";
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

export function getVisibleSelectionCount({
	availableWidth,
	itemWidths,
	gap,
	getSummaryWidth,
	maxVisibleValues,
}: VisibleSelectionCountInput) {
	if (availableWidth <= 0 || itemWidths.length === 0) {
		return 0;
	}

	const cappedItemCount =
		maxVisibleValues === undefined
			? itemWidths.length
			: Math.min(itemWidths.length, maxVisibleValues);

	let visibleCount = 0;
	let usedWidth = 0;

	for (let index = 0; index < cappedItemCount; index += 1) {
		const itemWidth = itemWidths[index];
		if (itemWidth === undefined) {
			break;
		}

		const nextWidth =
			usedWidth + (index > 0 ? gap : 0) + itemWidth;
		const remainingCount = itemWidths.length - (index + 1);
		const summaryWidth =
			remainingCount > 0 ? gap + getSummaryWidth(remainingCount) : 0;

		if (nextWidth + summaryWidth > availableWidth) {
			break;
		}

		usedWidth = nextWidth;
		visibleCount = index + 1;
	}

	return visibleCount;
}

export function buildVisibleSelections<TSelection>(
	selectedOptions: TSelection[],
	visibleSelectionCount: number,
) {
	const visibleOptions = selectedOptions.slice(0, visibleSelectionCount);
	const remainingCount = selectedOptions.length - visibleOptions.length;

	return { visibleOptions, remainingCount };
}
