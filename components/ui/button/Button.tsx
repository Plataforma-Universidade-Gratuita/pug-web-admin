import clsx from "clsx";

import { Tooltip } from "@/components/ui";
import { BUTTON_SIZES, BUTTON_USAGES, BUTTON_VARIANTS } from "@/constants/ui";
import type { ButtonProps } from "@/types/client";

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
	title,
	tooltipContent,
	type = "button",
	usage = "primary",
	variant = "flat",
	...props
}: ButtonProps) {
	const label = isLoading && loadingText ? loadingText : children;
	const derivedAriaLabel =
		ariaLabel ??
		(typeof title === "string" ? title : undefined) ??
		loadingText ??
		getAccessibleText(children);
	const tooltipLabel =
		tooltipContent ??
		(typeof title === "string" ? title : undefined) ??
		derivedAriaLabel;
	const spinner = (
		<span
			aria-hidden="true"
			className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
		/>
	);
	const button = (
		<button
			type={type}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			aria-label={derivedAriaLabel}
			title={size === "icon" ? undefined : title}
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

	if (size === "icon" && tooltipLabel) {
		return <Tooltip content={tooltipLabel}>{button}</Tooltip>;
	}

	return button;
}
