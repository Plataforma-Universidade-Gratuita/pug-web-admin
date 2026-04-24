import clsx from "clsx";
import { BUTTON_SIZES, BUTTON_USAGES, BUTTON_VARIANTS } from "constants/button";
import type { ButtonProps } from "types/client";

import { getAccessibleText } from "./utils";

export function Button({
	"aria-label": ariaLabel,
	children,
	className,
	disabled,
	isLoading = false,
	leadingIcon,
	loadingText,
	size = "md",
	trailingIcon,
	type = "button",
	usage = "primary",
	variant = "flat",
	...props
}: ButtonProps) {
	const label = isLoading && loadingText ? loadingText : children;
	const derivedAriaLabel =
		ariaLabel ??
		(typeof props.title === "string" ? props.title : undefined) ??
		loadingText ??
		getAccessibleText(children);
	const spinner = (
		<span
			aria-hidden="true"
			className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
		/>
	);

	return (
		<button
			type={type}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			aria-label={derivedAriaLabel}
			className={clsx(
				"btn-base focus-ring inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:shadow-none",
				BUTTON_USAGES[usage],
				BUTTON_VARIANTS[variant],
				BUTTON_SIZES[size],
				size === "icon" && "rounded-full",
				className,
			)}
			{...props}
		>
			{isLoading ? spinner : leadingIcon}
			{label ? <span>{label}</span> : null}
			{!isLoading ? trailingIcon : null}
		</button>
	);
}
