import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size"
> {
	leadingIcon?: ReactNode;
	trailingIcon?: ReactNode;
	showPasswordToggle?: boolean;
}
