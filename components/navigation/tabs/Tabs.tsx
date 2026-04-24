"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";

import type {
	TabsContentProps,
	TabsListProps,
	TabsProps,
	TabsTriggerProps,
} from "@/types/client";

export function Tabs({ children, className, ...props }: TabsProps) {
	return (
		<RadixTabs.Root
			className={clsx("tabs-root", className)}
			{...props}
		>
			{children}
		</RadixTabs.Root>
	);
}

export function TabsList({ children, className, ...props }: TabsListProps) {
	return (
		<RadixTabs.List
			className={clsx("tabs-list", className)}
			{...props}
		>
			{children}
		</RadixTabs.List>
	);
}

export function TabsTrigger({
	children,
	className,
	...props
}: TabsTriggerProps) {
	return (
		<RadixTabs.Trigger
			className={clsx("tabs-trigger focus-ring", className)}
			{...props}
		>
			{children}
		</RadixTabs.Trigger>
	);
}

export function TabsContent({
	children,
	className,
	...props
}: TabsContentProps) {
	return (
		<RadixTabs.Content
			className={clsx("tabs-content focus-ring", className)}
			{...props}
		>
			{children}
		</RadixTabs.Content>
	);
}
