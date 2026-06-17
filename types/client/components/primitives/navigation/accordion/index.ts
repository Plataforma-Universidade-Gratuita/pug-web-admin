import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixAccordion from "@radix-ui/react-accordion";

export type AccordionProps =
	| ({
			children: ReactNode;
			className?: string;
	  } & Omit<
			RadixAccordion.AccordionSingleProps,
			"type" | "children" | "className"
	  > & {
				type?: "single";
			})
	| ({
			children: ReactNode;
			className?: string;
	  } & Omit<
			RadixAccordion.AccordionMultipleProps,
			"type" | "children" | "className"
	  > & {
				type: "multiple";
			});

export interface AccordionItemProps extends ComponentPropsWithoutRef<
	typeof RadixAccordion.Item
> {
	children: ReactNode;
	value: string;
}

export interface AccordionTriggerProps extends ComponentPropsWithoutRef<
	typeof RadixAccordion.Trigger
> {
	children: ReactNode;
}

export interface AccordionContentProps extends ComponentPropsWithoutRef<
	typeof RadixAccordion.Content
> {
	children: ReactNode;
}
