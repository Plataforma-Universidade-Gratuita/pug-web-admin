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
			className={clsx("space-y-4", className)}
			{...props}
		>
			{children}
		</RadixTabs.Root>
	);
}

export function TabsList({ children, className, ...props }: TabsListProps) {
	return (
		<RadixTabs.List
			className={clsx(
				"surface-1 inline-flex flex-wrap gap-2 rounded-[var(--twc-radius-lg)] p-1",
				className,
			)}
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
			className={clsx(
				"focus-ring rounded-[calc(var(--twc-radius-lg)-0.25rem)] px-3 py-2 text-sm font-medium transition-colors data-[state=active]:bg-[color:var(--twc-surface-2)] data-[state=active]:shadow-[var(--twc-shadow-sm)]",
				className,
			)}
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
			className={clsx("focus-ring outline-none", className)}
			{...props}
		>
			{children}
		</RadixTabs.Content>
	);
}
