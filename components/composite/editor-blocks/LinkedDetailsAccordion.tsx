"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/primitives";
import type { LinkedDetailsAccordionProps } from "@/types/client";

export function LinkedDetailsAccordion({
	items,
	defaultValue,
	className,
}: LinkedDetailsAccordionProps) {
	if (items.length === 0) {
		return null;
	}

	const resolvedDefaultValue = defaultValue ?? items[0]?.value;
	const accordionProps = {
		type: "single" as const,
		collapsible: true,
		...(className ? { className } : {}),
	};
	const content = items.map(item => (
		<AccordionItem
			key={item.value}
			value={item.value}
		>
			<AccordionTrigger>{item.title}</AccordionTrigger>
			<AccordionContent>{item.content}</AccordionContent>
		</AccordionItem>
	));

	if (resolvedDefaultValue) {
		return (
			<Accordion
				{...accordionProps}
				defaultValue={resolvedDefaultValue}
			>
				{content}
			</Accordion>
		);
	}

	return <Accordion {...accordionProps}>{content}</Accordion>;
}
