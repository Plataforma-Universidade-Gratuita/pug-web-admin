import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { ComboboxOption } from "@/types/client/components/primitives/forms/combobox";

export interface TextFieldFilterProps {
	label?: ReactNode;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export interface NumberFieldFilterProps {
	label?: ReactNode;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export interface AuditInfoFilterOption {
	value: string;
	label: ReactNode;
}

export interface AuditInfoFilterFieldsProps {
	dateFieldLabel: ReactNode;
	dateFieldPlaceholder: string;
	dateField: string;
	onDateFieldChange: (value: string) => void;
	dateFieldOptions: AuditInfoFilterOption[];
	startDateLabel: ReactNode;
	startDatePlaceholder?: string | undefined;
	startDate: string;
	onStartDateChange: (value: string) => void;
	endDateLabel: ReactNode;
	endDatePlaceholder?: string | undefined;
	endDate: string;
	onEndDateChange: (value: string) => void;
}

export interface AsyncComboboxFilterFieldProps {
	label: ReactNode;
	options: ComboboxOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	values?: string[];
	onValuesChange?: (values: string[]) => void;
	multiple?: boolean;
	placeholder?: ReactNode;
	searchPlaceholder?: string;
	emptyMessage?: ReactNode;
	disabled?: boolean;
	isError?: boolean;
	errorTitle?: ReactNode;
	errorDescription?: ReactNode;
	onRefreshError?: () => void;
}

export interface DateRangeFilterFieldsProps {
	startLabel: ReactNode;
	startValue: string;
	onStartValueChange: (value: string) => void;
	endLabel: ReactNode;
	endValue: string;
	onEndValueChange: (value: string) => void;
	startPlaceholder?: string;
	endPlaceholder?: string;
	startDisabled?: boolean;
	endDisabled?: boolean;
	className?: string;
}

export type ServicePageDraftFilters = object;

export interface UseDraftFiltersOptions<
	TFilters extends ServicePageDraftFilters,
> {
	initialFilters: TFilters;
}

export interface UseDraftFiltersResult<
	TFilters extends ServicePageDraftFilters,
> {
	appliedFilters: TFilters;
	draftFilters: TFilters;
	hasAppliedFilters: boolean;
	applyDraftFilters: () => void;
	clearFilters: () => void;
	setAppliedFilters: Dispatch<SetStateAction<TFilters>>;
	setDraftFilter: <TKey extends keyof TFilters>(
		key: TKey,
		value: TFilters[TKey],
	) => void;
	setDraftFilters: Dispatch<SetStateAction<TFilters>>;
}
