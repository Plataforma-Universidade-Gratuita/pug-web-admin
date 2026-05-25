"use client";

import type { CSSProperties } from "react";

import * as RadixAccordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

import { Icon } from "@/components";
import type {
	AccordionContentProps,
	AccordionItemProps,
	AccordionProps,
	AccordionTriggerProps,
} from "@/types";

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
				className={clsx("accordion-root", className)}
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
			className={clsx("accordion-root", className)}
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
			className={clsx("accordion-item", className)}
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
				className={clsx("accordion-trigger focus-ring group", className)}
				{...props}
			>
				<span className="ty-sm-semibold">{children}</span>
				<span className="accordion-icon">
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
	style,
	...props
}: AccordionContentProps) {
	return (
		<RadixAccordion.Content
			className={clsx("accordion-content", className)}
			style={
				{
					"--accordion-content-height": "var(--radix-accordion-content-height)",
					...style,
				} as CSSProperties
			}
			{...props}
		>
			<div className="accordion-body">{children}</div>
		</RadixAccordion.Content>
	);
}
