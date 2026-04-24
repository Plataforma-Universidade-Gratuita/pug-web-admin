import type { ButtonHTMLAttributes, ReactNode } from "react";

import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	isLoading?: boolean;
};

export function Button({
	children,
	className,
	disabled,
	isLoading = false,
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled || isLoading}
			className={clsx(
				"btn-primary focus-ring inline-flex items-center justify-center gap-2",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
