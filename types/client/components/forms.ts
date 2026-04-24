import type {
	InputHTMLAttributes,
	ReactNode,
	TextareaHTMLAttributes,
} from "react";

export interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	leadingIcon?: ReactNode;
	trailingIcon?: ReactNode;
	showPasswordToggle?: boolean;
}

export type DatePickerProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size" | "type"
>;

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
}
