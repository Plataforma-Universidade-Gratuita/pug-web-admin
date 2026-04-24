import type {
	ButtonHTMLAttributes,
	ComponentPropsWithoutRef,
	ReactNode,
} from "react";

import type * as RadixAccordion from "@radix-ui/react-accordion";
import type * as RadixCheckbox from "@radix-ui/react-checkbox";
import type * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import type * as RadixRadioGroup from "@radix-ui/react-radio-group";
import type * as RadixSelect from "@radix-ui/react-select";
import type * as RadixSwitch from "@radix-ui/react-switch";
import type * as RadixTabs from "@radix-ui/react-tabs";
import type * as RadixToggle from "@radix-ui/react-toggle";
import type * as RadixToggleGroup from "@radix-ui/react-toggle-group";

import {
	BUTTON_SIZES,
	BUTTON_USAGES,
	BUTTON_VARIANTS,
} from "@/constants/components";

export type ButtonUsage = keyof typeof BUTTON_USAGES;
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"children"
> & {
	children?: ReactNode;
	isLoading?: boolean;
	leadingIcon?: ReactNode;
	trailingIcon?: ReactNode;
	loadingText?: string;
	size?: ButtonSize;
	tooltipContent?: ReactNode;
	usage?: ButtonUsage;
	variant?: ButtonVariant;
};

export type AccordionProps =
	| ({
			children: ReactNode;
			className?: string;
	  } & Omit<
			RadixAccordion.AccordionSingleProps,
			"type" | "children" | "className"
	  > & {
				type?: "single";
			})
	| ({
			children: ReactNode;
			className?: string;
	  } & Omit<
			RadixAccordion.AccordionMultipleProps,
			"type" | "children" | "className"
	  > & {
				type: "multiple";
			});

export interface AccordionItemProps
	extends ComponentPropsWithoutRef<typeof RadixAccordion.Item> {
	children: ReactNode;
	value: string;
}

export interface AccordionTriggerProps
	extends ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> {
	children: ReactNode;
}

export interface AccordionContentProps
	extends ComponentPropsWithoutRef<typeof RadixAccordion.Content> {
	children: ReactNode;
}

export interface DropdownMenuProps {
	children: ReactNode;
	open?: boolean | undefined;
	onOpenChange?: ((open: boolean) => void) | undefined;
}

export interface DropdownMenuTriggerProps {
	children: ReactNode;
}

export interface DropdownMenuContentProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>,
		"children"
	> {
	children: ReactNode;
	className?: string;
}

export interface DropdownMenuItemProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>,
		"children"
	> {
	children: ReactNode;
	inset?: boolean;
}

export interface DropdownMenuLabelProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label>,
		"children"
	> {
	children: ReactNode;
	inset?: boolean;
}

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
	typeof RadixDropdownMenu.Separator
>;

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

export interface SelectTriggerProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixSelect.Trigger>,
		"children"
	> {
	placeholder?: ReactNode;
	className?: string;
}

export interface SelectContentProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixSelect.Content>,
		"children"
	> {
	children: ReactNode;
	className?: string;
}

export interface SelectGroupProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixSelect.Group>, "children"> {
	children: ReactNode;
}

export interface SelectItemProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixSelect.Item>, "children"> {
	children: ReactNode;
}

export interface SelectLabelProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixSelect.Label>, "children"> {
	children: ReactNode;
}

export type SelectSeparatorProps = ComponentPropsWithoutRef<
	typeof RadixSelect.Separator
>;

export interface CheckboxProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
		"children"
	> {
	label?: ReactNode;
	description?: ReactNode;
}

export interface RadioGroupProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
		"children"
	> {
	children: ReactNode;
}

export interface RadioGroupItemProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>,
		"children"
	> {
	label?: ReactNode;
	description?: ReactNode;
}

export interface SwitchProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixSwitch.Root>, "children"> {
	label?: ReactNode;
	description?: ReactNode;
}

export interface ToggleProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixToggle.Root>, "children"> {
	children: ReactNode;
}

export type ToggleGroupProps =
	| ({
			children: ReactNode;
	  } & Omit<RadixToggleGroup.ToggleGroupSingleProps, "type" | "children"> & {
				type?: "single";
			})
	| ({
			children: ReactNode;
	  } & Omit<RadixToggleGroup.ToggleGroupMultipleProps, "type" | "children"> & {
				type: "multiple";
			});

export interface ToggleGroupItemProps
	extends Omit<
		ComponentPropsWithoutRef<typeof RadixToggleGroup.Item>,
		"children"
	> {
	children: ReactNode;
}

export interface TabsProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixTabs.Root>, "children"> {
	children: ReactNode;
}

export interface TabsListProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixTabs.List>, "children"> {
	children: ReactNode;
}

export interface TabsTriggerProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixTabs.Trigger>, "children"> {
	children: ReactNode;
}

export interface TabsContentProps
	extends Omit<ComponentPropsWithoutRef<typeof RadixTabs.Content>, "children"> {
	children: ReactNode;
}
