"use client";

import { forwardRef, useState } from "react";

import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import type { InputProps } from "@/types/client";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		type = "text",
		className,
		leadingIcon,
		trailingIcon,
		showPasswordToggle = false,
		disabled,
		...props
	},
	ref,
) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const isPasswordField = type === "password";
	const resolvedType =
		isPasswordField && showPasswordToggle
			? isPasswordVisible
				? "text"
				: "password"
			: type;

	return (
		<div
			className={clsx(
				"border-default-2 surface-2 focus-within:focus-ring flex items-center rounded-[var(--twc-radius-lg)] border transition-colors",
				disabled ? "opacity-60" : null,
				className,
			)}
		>
			{leadingIcon ? (
				<span className="pl-3 text-[color:var(--twc-muted)]">
					{leadingIcon}
				</span>
			) : null}
			<input
				ref={ref}
				type={resolvedType}
				disabled={disabled}
				className={clsx(
					"w-full bg-transparent px-3 py-2.5 text-base text-[color:var(--twc-text)] outline-none placeholder:text-[color:var(--twc-muted)] disabled:cursor-not-allowed",
					leadingIcon ? "pl-2" : null,
					trailingIcon || (isPasswordField && showPasswordToggle)
						? "pr-2"
						: null,
				)}
				{...props}
			/>
			{isPasswordField && showPasswordToggle ? (
				<button
					type="button"
					disabled={disabled}
					onClick={() => setIsPasswordVisible(current => !current)}
					className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--twc-muted)] transition hover:bg-[color:var(--twc-surface-1)] hover:text-[color:var(--twc-text)] disabled:pointer-events-none"
					aria-label={
						isPasswordVisible
							? "Hide password content"
							: "Show password content"
					}
				>
					<Icon
						icon={isPasswordVisible ? EyeOff : Eye}
						className="h-4 w-4"
					/>
				</button>
			) : trailingIcon ? (
				<span className="pr-3 text-[color:var(--twc-muted)]">
					{trailingIcon}
				</span>
			) : null}
		</div>
	);
});
