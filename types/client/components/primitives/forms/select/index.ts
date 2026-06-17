import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixSelect from "@radix-ui/react-select";

export interface SelectProps {
	children: ReactNode;
	value?: string | undefined;
	defaultValue?: string | undefined;
	onValueChange?: ((value: string) => void) | undefined;
	disabled?: boolean;
}

export interface SelectContextValue {
	clearSelection: () => void;
	disabled: boolean;
	hasValue: boolean;
}

export interface SelectProviderProps {
	children: ReactNode;
	value: SelectContextValue;
}

export interface SelectTriggerProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSelect.Trigger>,
	"children"
> {
	placeholder?: ReactNode;
	className?: string;
}

export interface SelectContentProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSelect.Content>,
	"children"
> {
	children: ReactNode;
	className?: string;
}

export interface SelectGroupProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSelect.Group>,
	"children"
> {
	children: ReactNode;
}

export interface SelectItemProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSelect.Item>,
	"children"
> {
	children: ReactNode;
}

export interface SelectLabelProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSelect.Label>,
	"children"
> {
	children: ReactNode;
}

export type SelectSeparatorProps = ComponentPropsWithoutRef<
	typeof RadixSelect.Separator
>;
