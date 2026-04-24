"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { Eye, EyeOff, X } from "lucide-react";

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
	const [currentValue, setCurrentValue] = useState(
		String(props.value ?? props.defaultValue ?? ""),
	);
	const internalRef = useRef<HTMLInputElement>(null);
	const isPasswordField = type === "password";
	const isSearchField = type === "search";
	const resolvedType =
		isPasswordField && showPasswordToggle
			? isPasswordVisible
				? "text"
				: "password"
			: type;
	const hasSearchValue = isSearchField && currentValue.length > 0;

	useEffect(() => {
		if (props.value !== undefined) {
			setCurrentValue(String(props.value));
		}
	}, [props.value]);

	function assignRef(node: HTMLInputElement | null) {
		internalRef.current = node;
		if (typeof ref === "function") {
			ref(node);
			return;
		}
		if (ref) {
			ref.current = node;
		}
	}

	function clearSearchValue() {
		const input = internalRef.current;
		if (!input) return;

		const nativeValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			"value",
		)?.set;
		nativeValueSetter?.call(input, "");
		input.dispatchEvent(new Event("input", { bubbles: true }));
		input.focus();
	}

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
				ref={assignRef}
				type={resolvedType}
				disabled={disabled}
				className={clsx(
					"w-full bg-transparent px-3 py-2.5 text-base text-[color:var(--twc-text)] outline-none placeholder:text-[color:var(--twc-muted)] disabled:cursor-not-allowed",
					leadingIcon ? "pl-2" : null,
					trailingIcon ||
						(isPasswordField && showPasswordToggle) ||
						hasSearchValue
						? "pr-2"
						: null,
				)}
				{...props}
				onChange={event => {
					setCurrentValue(event.target.value);
					props.onChange?.(event);
				}}
			/>
			{hasSearchValue ? (
				<button
					type="button"
					disabled={disabled}
					onClick={clearSearchValue}
					className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--twc-muted)] transition hover:bg-[color:var(--twc-surface-1)] hover:text-[color:var(--twc-text)] disabled:pointer-events-none"
					aria-label="Clear search"
				>
					<Icon
						icon={X}
						className="h-3.5 w-3.5"
					/>
				</button>
			) : null}
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
