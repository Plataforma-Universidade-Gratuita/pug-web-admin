export function buildVisibleSelections<TSelection>(
	selectedOptions: TSelection[],
	maxVisibleValues: number,
) {
	const visibleOptions = selectedOptions.slice(0, maxVisibleValues);
	const remainingCount = selectedOptions.length - visibleOptions.length;

	return { visibleOptions, remainingCount };
}
