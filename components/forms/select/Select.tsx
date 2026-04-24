"use client";

import * as RadixSelect from "@radix-ui/react-select";
import clsx from "clsx";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

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

export function Select({
	children,
	value,
	defaultValue,
	onValueChange,
	disabled,
}: SelectProps) {
	const rootProps: Partial<{
		value: string;
		defaultValue: string;
		onValueChange: (value: string) => void;
		disabled: boolean;
	}> = {};

	if (value !== undefined) rootProps.value = value;
	if (defaultValue !== undefined) rootProps.defaultValue = defaultValue;
	if (onValueChange !== undefined) rootProps.onValueChange = onValueChange;
	if (disabled !== undefined) rootProps.disabled = disabled;

	return <RadixSelect.Root {...rootProps}>{children}</RadixSelect.Root>;
}

export function SelectTrigger({
	placeholder,
	className,
	...props
}: SelectTriggerProps) {
	return (
		<RadixSelect.Trigger
			className={clsx(
				"border-default-2 surface-2 focus-ring inline-flex h-10 w-full items-center justify-between gap-3 rounded-[var(--twc-radius-lg)] border px-3 py-2 text-left disabled:pointer-events-none disabled:opacity-60 data-[placeholder]:text-[color:var(--twc-muted)]",
				className,
			)}
			{...props}
		>
			<RadixSelect.Value placeholder={placeholder} />
			<RadixSelect.Icon asChild>
				<span className="text-[color:var(--twc-muted)]">
					<Icon
						icon={ChevronDown}
						className="h-4 w-4"
					/>
				</span>
			</RadixSelect.Icon>
		</RadixSelect.Trigger>
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
				"focus-ring relative flex w-full cursor-default items-center gap-3 rounded-[var(--twc-radius-lg)] px-3 py-2 pr-8 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-[color:var(--twc-surface-1)]",
				className,
			)}
			{...props}
		>
			<RadixSelect.ItemText>{children}</RadixSelect.ItemText>
			<RadixSelect.ItemIndicator className="absolute right-3 inline-flex items-center justify-center text-[color:var(--color-brand)]">
				<Icon
					icon={Check}
					className="h-4 w-4"
				/>
			</RadixSelect.ItemIndicator>
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
