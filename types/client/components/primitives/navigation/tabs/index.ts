/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixTabs from "@radix-ui/react-tabs";

export interface TabsProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixTabs.Root>,
	"children"
> {
	children: ReactNode;
}

export type TabsListVariant = "default" | "icon";

export interface TabsListProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixTabs.List>,
	"children"
> {
	children: ReactNode;
	variant?: TabsListVariant;
}

export interface TabsTriggerProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixTabs.Trigger>,
	"children"
> {
	children: ReactNode;
	tooltipContent?: ReactNode;
}

export interface TabsContentProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixTabs.Content>,
	"children"
> {
	children: ReactNode;
}
