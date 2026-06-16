import type {
	ChangeEventHandler,
	InputHTMLAttributes,
	ReactNode,
	TextareaHTMLAttributes,
} from "react";

import type { FieldValues, UseFormReturn } from "react-hook-form";

import type {
	BadgeTone,
	PopoverContentProps,
} from "@/types/client/components/display";

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
	panelSide?: PopoverContentProps["side"];
	panelAlign?: PopoverContentProps["align"];
	panelAvoidCollisions?: PopoverContentProps["avoidCollisions"];
	panelCollisionPadding?: PopoverContentProps["collisionPadding"];
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

export interface CpfFormFieldExistingUser {
	cpf: string;
	cpfFormatted: string;
	name: string;
}

export interface CpfFormFieldProps<
	TValues extends FieldValues & {
		cpf: string;
		name: string;
	},
> {
	form: UseFormReturn<TValues>;
	existingUsers: CpfFormFieldExistingUser[];
	id?: string;
	label: ReactNode;
	tooltipContent?: ReactNode;
	placeholder?: ReactNode;
	searchPlaceholder?: string;
	emptyMessage?: ReactNode;
	createOptionLabel?: (value: string) => ReactNode;
	onExistingUserChange?: (user: CpfFormFieldExistingUser | null) => void;
}

export type MultiSelectSelectionTone = BadgeTone;

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
