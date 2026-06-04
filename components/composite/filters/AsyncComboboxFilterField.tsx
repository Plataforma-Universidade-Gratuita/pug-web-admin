import { Combobox, Label, SomeErrorState } from "@/components";
import type { AsyncComboboxFilterFieldProps } from "@/types";

export function AsyncComboboxFilterField({
	label,
	options,
	value,
	onValueChange,
	values,
	onValuesChange,
	multiple = false,
	placeholder,
	searchPlaceholder,
	emptyMessage,
	disabled = false,
	isError = false,
	errorTitle,
	errorDescription,
	onRefreshError,
}: AsyncComboboxFilterFieldProps) {
	if (isError) {
		if (!errorTitle || !errorDescription || !onRefreshError) {
			return null;
		}

		return (
			<SomeErrorState
				title={errorTitle}
				description={errorDescription}
				onRefresh={onRefreshError}
			/>
		);
	}

	return (
		<div className="grid gap-2">
			<Label>{label}</Label>
			<Combobox
				options={options}
				multiple={multiple}
				disabled={disabled}
				{...(value !== undefined ? { value } : {})}
				{...(onValueChange !== undefined ? { onValueChange } : {})}
				{...(values !== undefined ? { values } : {})}
				{...(onValuesChange !== undefined ? { onValuesChange } : {})}
				{...(placeholder !== undefined ? { placeholder } : {})}
				{...(searchPlaceholder !== undefined ? { searchPlaceholder } : {})}
				{...(emptyMessage !== undefined ? { emptyMessage } : {})}
			/>
		</div>
	);
}
