import type {
	ChangeEventHandler,
	InputHTMLAttributes,
	ReactNode,
	TextareaHTMLAttributes,
} from "react";

import { BADGE_TONES } from "@/constants/components";

export interface InputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size"
> {
	leadingIcon?: ReactNode;
	trailingIcon?: ReactNode;
	showPasswordToggle?: boolean;
}

export interface DatePickerProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size" | "type" | "value" | "defaultValue" | "onChange"
> {
	value?: string;
	defaultValue?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onValueChange?: (value: string) => void;
}

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

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

export interface ComboboxProps {
	options: ComboboxOption[];
	id?: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	placeholder?: ReactNode;
	searchPlaceholder?: string;
	emptyMessage?: ReactNode;
	disabled?: boolean;
	className?: string;
}

export type MultiSelectSelectionTone = keyof typeof BADGE_TONES;

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
