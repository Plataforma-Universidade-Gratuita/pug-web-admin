/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
