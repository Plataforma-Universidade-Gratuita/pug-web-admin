import type { ButtonHTMLAttributes, ReactNode } from "react";

import {
	BUTTON_SIZES,
	BUTTON_USAGES,
	BUTTON_VARIANTS,
} from "@/constants/button";

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
	usage?: ButtonUsage;
	variant?: ButtonVariant;
};
