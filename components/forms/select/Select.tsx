"use client";

import { createContext, useContext, useMemo, useState } from "react";

import * as RadixSelect from "@radix-ui/react-select";
import clsx from "clsx";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { Icon } from "@/components/display/icon/Icon";
import type {
	SelectContentProps,
	SelectGroupProps,
	SelectItemProps,
	SelectLabelProps,
	SelectProps,
	SelectSeparatorProps,
	SelectTriggerProps,
} from "@/types/client";

const SelectContext = createContext<{
	clearSelection: () => void;
	disabled: boolean;
	hasValue: boolean;
}>({
	clearSelection: () => undefined,
	disabled: false,
	hasValue: false,
});

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
		<SelectContext.Provider value={contextValue}>
			<RadixSelect.Root {...rootProps}>{children}</RadixSelect.Root>
		</SelectContext.Provider>
	);
}

export function SelectTrigger({
	placeholder,
	className,
	...props
}: SelectTriggerProps) {
	const { clearSelection, disabled, hasValue } = useContext(SelectContext);

	return (
		<div className="relative w-full">
			<RadixSelect.Trigger
				className={clsx(
					"border-default-2 surface-2 focus-ring inline-flex h-10 w-full items-center justify-between gap-3 rounded-[var(--twc-radius-lg)] border px-3 py-2 pr-18 text-left disabled:pointer-events-none disabled:opacity-60 data-[placeholder]:text-[color:var(--twc-muted)]",
					className,
				)}
				{...props}
			>
				<RadixSelect.Value placeholder={placeholder} />
			</RadixSelect.Trigger>
			<div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2">
				{hasValue ? (
					<button
						type="button"
						disabled={disabled}
						onClick={event => {
							event.preventDefault();
							event.stopPropagation();
							clearSelection();
						}}
						className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-[color:var(--twc-muted)] transition hover:bg-[color:var(--twc-surface-1)] hover:text-[color:var(--twc-text)] disabled:pointer-events-none"
						aria-label="Clear selection"
					>
						<Icon
							icon={X}
							className="h-3.5 w-3.5"
						/>
					</button>
				) : null}
				<span className="text-[color:var(--twc-muted)]">
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
				className={clsx(
					"border-default-2 surface-2 shadow-strong z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[var(--twc-radius-xl)] border",
					className,
				)}
				{...props}
			>
				<RadixSelect.ScrollUpButton className="flex h-8 items-center justify-center text-[color:var(--twc-muted)]">
					<Icon
						icon={ChevronUp}
						className="h-4 w-4"
					/>
				</RadixSelect.ScrollUpButton>
				<RadixSelect.Viewport className="p-1">{children}</RadixSelect.Viewport>
				<RadixSelect.ScrollDownButton className="flex h-8 items-center justify-center text-[color:var(--twc-muted)]">
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
			className={clsx(
				"focus-ring relative flex w-full cursor-default items-center gap-3 rounded-[var(--twc-radius-lg)] border border-transparent px-3 py-2 pl-4 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-[color:var(--twc-surface-1)] data-[state=checked]:border-[color:color-mix(in_srgb,var(--color-brand)_18%,transparent)] data-[state=checked]:bg-[color:color-mix(in_srgb,var(--color-brand)_14%,var(--twc-surface-2))] data-[state=checked]:text-[color:var(--twc-text)]",
				className,
			)}
			{...props}
		>
			<RadixSelect.ItemIndicator className="absolute left-1.5 inline-flex items-center justify-center">
				<span
					aria-hidden="true"
					className="h-5 w-1 rounded-full bg-[color:var(--color-brand)]"
				/>
			</RadixSelect.ItemIndicator>
			<RadixSelect.ItemText>
				<span className="block data-[state=checked]:font-semibold">
					{children}
				</span>
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
			className={clsx(
				"ty-sm-semibold px-3 py-2 text-[color:var(--twc-muted)]",
				className,
			)}
			{...props}
		>
			{children}
		</RadixSelect.Label>
	);
}

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
	return (
		<RadixSelect.Separator
			className={clsx("border-default-2 my-1 h-px border-t", className)}
			{...props}
		/>
	);
}
