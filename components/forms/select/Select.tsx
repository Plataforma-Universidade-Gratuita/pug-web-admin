"use client";

import { useMemo, useState } from "react";

import * as RadixSelect from "@radix-ui/react-select";
import clsx from "clsx";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import { SelectProvider, useSelect } from "@/contexts/select";
import type {
	SelectContentProps,
	SelectGroupProps,
	SelectItemProps,
	SelectLabelProps,
	SelectProps,
	SelectSeparatorProps,
	SelectTriggerProps,
} from "@/types/client";

export function Select({
	children,
	value,
	defaultValue,
	onValueChange,
	disabled,
}: SelectProps) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(defaultValue ?? "");
	const currentValue = isControlled ? value : internalValue;
	const rootProps: Partial<{
		value: string;
		defaultValue: string;
		onValueChange: (value: string) => void;
		disabled: boolean;
	}> = {};

	if (currentValue !== undefined) rootProps.value = currentValue;
	rootProps.onValueChange = nextValue => {
		if (!isControlled) setInternalValue(nextValue);
		onValueChange?.(nextValue);
	};
	if (disabled !== undefined) rootProps.disabled = disabled;

	const contextValue = useMemo(
		() => ({
			clearSelection: () => {
				if (!isControlled) setInternalValue("");
				onValueChange?.("");
			},
			disabled: disabled ?? false,
			hasValue: Boolean(currentValue),
		}),
		[currentValue, disabled, isControlled, onValueChange],
	);

	return (
		<SelectProvider value={contextValue}>
			<RadixSelect.Root {...rootProps}>{children}</RadixSelect.Root>
		</SelectProvider>
	);
}

export function SelectTrigger({
	placeholder,
	className,
	...props
}: SelectTriggerProps) {
	const { clearSelection, disabled, hasValue } = useSelect();

	return (
		<div className="select-trigger-shell">
			<RadixSelect.Trigger
				className={clsx("select-trigger", className)}
				{...props}
			>
				<RadixSelect.Value placeholder={placeholder} />
			</RadixSelect.Trigger>
			<div className="select-adornment">
				{hasValue ? (
					<button
						type="button"
						disabled={disabled}
						onClick={event => {
							event.preventDefault();
							event.stopPropagation();
							clearSelection();
						}}
						className="field-icon-button select-clear-button"
						aria-label="Clear selection"
					>
						<Icon
							icon={X}
							className="h-3.5 w-3.5"
						/>
					</button>
				) : null}
				<span className="select-chevron">
					<Icon
						icon={ChevronDown}
						className="h-4 w-4"
					/>
				</span>
			</div>
		</div>
	);
}

export function SelectContent({
	children,
	className,
	position = "popper",
	...props
}: SelectContentProps) {
	return (
		<RadixSelect.Portal>
			<RadixSelect.Content
				position={position}
				className={clsx("select-content", className)}
				{...props}
			>
				<RadixSelect.ScrollUpButton className="select-scroll-button">
					<Icon
						icon={ChevronUp}
						className="h-4 w-4"
					/>
				</RadixSelect.ScrollUpButton>
				<RadixSelect.Viewport className="select-viewport">
					{children}
				</RadixSelect.Viewport>
				<RadixSelect.ScrollDownButton className="select-scroll-button">
					<Icon
						icon={ChevronDown}
						className="h-4 w-4"
					/>
				</RadixSelect.ScrollDownButton>
			</RadixSelect.Content>
		</RadixSelect.Portal>
	);
}

export function SelectGroup({ children, ...props }: SelectGroupProps) {
	return <RadixSelect.Group {...props}>{children}</RadixSelect.Group>;
}

export function SelectItem({ children, className, ...props }: SelectItemProps) {
	return (
		<RadixSelect.Item
			className={clsx("focus-ring select-item", className)}
			{...props}
		>
			<span className="select-item-indicator">
				<span
					aria-hidden="true"
					className="select-item-indicator-bar"
				/>
			</span>
			<RadixSelect.ItemText className="select-item-text">
				<span className="select-item-label">{children}</span>
			</RadixSelect.ItemText>
		</RadixSelect.Item>
	);
}

export function SelectLabel({
	children,
	className,
	...props
}: SelectLabelProps) {
	return (
		<RadixSelect.Label
			className={clsx("select-label", className)}
			{...props}
		>
			{children}
		</RadixSelect.Label>
	);
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
	return (
		<RadixSelect.Separator
			className={clsx("select-separator", className)}
			{...props}
		/>
	);
}
