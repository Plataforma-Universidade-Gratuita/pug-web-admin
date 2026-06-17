import type { ReactNode } from "react";

import type { BadgeTone } from "@/types/client/components/primitives/display/badge";

export interface MultiSelectOption {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
}

export interface ComboboxOption {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
	keywords?: string[];
	searchText?: string;
}

export type MultiSelectSelectionTone = BadgeTone;

export interface ComboboxProps {
	options: ComboboxOption[];
	id?: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	values?: string[];
	defaultValues?: string[];
	onValuesChange?: (value: string[]) => void;
	multiple?: boolean;
	placeholder?: ReactNode;
	searchPlaceholder?: string;
	emptyMessage?: ReactNode;
	creatable?: boolean;
	createLabel?: (value: string) => ReactNode;
	onCreateValue?: (value: string) => string | void;
	queryNormalizer?: (value: string) => string;
	canCreateValue?: (value: string, options: ComboboxOption[]) => boolean;
	disabled?: boolean;
	className?: string;
	maxVisibleValues?: number;
	selectionTone?: MultiSelectSelectionTone;
}

export interface VisibleSelectionCountInput {
	availableWidth: number;
	itemWidths: number[];
	gap: number;
	getSummaryWidth: (remainingCount: number) => number;
	maxVisibleValues?: number | undefined;
}

export interface MultiSelectProps {
	options: MultiSelectOption[];
	id?: string;
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
	placeholder?: ReactNode;
	disabled?: boolean;
	className?: string;
	maxVisibleValues?: number;
	selectionTone?: MultiSelectSelectionTone;
}
