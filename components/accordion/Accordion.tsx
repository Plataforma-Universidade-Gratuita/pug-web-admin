"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

import { Icon } from "@/components/icon/Icon";
import type {
	AccordionContentProps,
	AccordionItemProps,
	AccordionProps,
	AccordionTriggerProps,
} from "@/types/client";

export function Accordion(props: AccordionProps) {
	if (props.type === "multiple") {
		const {
			children,
			className,
			type,
			value,
			defaultValue,
			onValueChange,
			...multipleProps
		} = props;

		return (
			<RadixAccordion.Root
				type={type}
				className={clsx("space-y-3", className)}
				{...(value !== undefined ? { value } : {})}
				{...(defaultValue !== undefined ? { defaultValue } : {})}
				{...(onValueChange !== undefined ? { onValueChange } : {})}
				{...multipleProps}
			>
				{children}
			</RadixAccordion.Root>
		);
	}

	const {
		children,
		className,
		type,
		value,
		defaultValue,
		onValueChange,
		collapsible,
		...singleProps
	} = props;

	return (
		<RadixAccordion.Root
			type={type ?? "single"}
			className={clsx("space-y-3", className)}
			{...(value !== undefined ? { value } : {})}
			{...(defaultValue !== undefined ? { defaultValue } : {})}
			{...(onValueChange !== undefined ? { onValueChange } : {})}
			{...(collapsible !== undefined ? { collapsible } : {})}
			{...singleProps}
		>
			{children}
		</RadixAccordion.Root>
	);
}

export function AccordionItem({
	children,
	className,
	...props
}: AccordionItemProps) {
	return (
		<RadixAccordion.Item
			className={clsx(
				"border-default-2 surface-1 overflow-hidden rounded-[var(--twc-radius-xl)] border",
				className,
			)}
			{...props}
		>
			{children}
		</RadixAccordion.Item>
	);
}

export function AccordionTrigger({
	children,
	className,
	...props
}: AccordionTriggerProps) {
	return (
		<RadixAccordion.Header>
			<RadixAccordion.Trigger
				className={clsx(
					"focus-ring group flex w-full items-center justify-between gap-4 p-4 text-left data-[state=open]:border-b data-[state=open]:border-[color:var(--twc-border-2)]",
					className,
				)}
				{...props}
			>
				<span className="ty-sm-semibold">{children}</span>
				<span className="text-[color:var(--twc-muted)] transition-transform duration-[var(--twc-duration-normal)] group-data-[state=open]:rotate-180">
					<Icon
						icon={ChevronDown}
						className="h-4 w-4"
					/>
				</span>
			</RadixAccordion.Trigger>
		</RadixAccordion.Header>
	);
}

export function AccordionContent({
	children,
	className,
	...props
}: AccordionContentProps) {
	return (
		<RadixAccordion.Content
			className={clsx(
				"overflow-hidden data-[state=closed]:animate-[accordion-up_var(--twc-duration-normal)_var(--twc-ease-standard)] data-[state=open]:animate-[accordion-down_var(--twc-duration-normal)_var(--twc-ease-standard)]",
				className,
			)}
			{...props}
		>
			<div className="p-4 pt-3">{children}</div>
		</RadixAccordion.Content>
	);
}
