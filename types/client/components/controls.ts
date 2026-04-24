import type {
	ButtonHTMLAttributes,
	ComponentPropsWithoutRef,
	ReactNode,
} from "react";

import type * as RadixAccordion from "@radix-ui/react-accordion";
import type * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import type * as RadixSelect from "@radix-ui/react-select";

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
