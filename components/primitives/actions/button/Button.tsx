import clsx from "clsx";

import { Tooltip } from "@/components";
import { getAccessibleText } from "@/components/actions/button/utils";
import { BUTTON_SIZES, BUTTON_USAGES, BUTTON_VARIANTS } from "@/constants";
import type { ButtonProps } from "@/types";

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
	usage,
	variant = "primary",
	...props
}: ButtonProps) {
	const resolvedUsage =
		usage ?? (variant === "secondary" ? "secondary" : "primary");
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
			className="btn-spinner"
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
				BUTTON_USAGES[resolvedUsage],
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
