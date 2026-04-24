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
			data-disabled={disabled ? "true" : "false"}
			className={clsx("field-shell", className)}
		>
			{leadingIcon ? (
				<span className="field-leading-icon">{leadingIcon}</span>
			) : null}
			<input
				ref={assignRef}
				type={resolvedType}
				disabled={disabled}
				className={clsx(
					"field-input",
					leadingIcon ? "field-input-leading" : null,
					trailingIcon ||
						(isPasswordField && showPasswordToggle) ||
						hasSearchValue
						? "field-input-trailing"
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
					className="field-icon-button field-clear-button"
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
					className="field-icon-button field-toggle-button"
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
				<span className="field-trailing-icon">{trailingIcon}</span>
			) : null}
		</div>
	);
});
