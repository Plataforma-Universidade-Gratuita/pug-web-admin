"use client";

import { createContext, useContext } from "react";

import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";

import { Tooltip } from "@/components";
import { ScrollArea } from "@/components/structure/scroll-area/ScrollArea";
import type {
	TabsContentProps,
	TabsListProps,
	TabsProps,
	TabsTriggerProps,
	TabsListVariant,
} from "@/types/client";

const TabsVariantContext = createContext<TabsListVariant>("default");

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

export function TabsList({
	children,
	className,
	variant = "default",
	...props
}: TabsListProps) {
	return (
		<TabsVariantContext.Provider value={variant}>
			<ScrollArea
				className="tabs-list-scroll"
				viewportClassName="tabs-list-scroll-viewport"
			>
				<RadixTabs.List
					className={clsx(
						"tabs-list",
						variant === "icon" && "tabs-list-icon",
						className,
					)}
					{...props}
				>
					{children}
				</RadixTabs.List>
			</ScrollArea>
		</TabsVariantContext.Provider>
	);
}

export function TabsTrigger({
	children,
	className,
	tooltipContent,
	...props
}: TabsTriggerProps) {
	const variant = useContext(TabsVariantContext);

	const trigger = (
		<RadixTabs.Trigger
			className={clsx(
				"tabs-trigger focus-ring",
				variant === "icon" && "tabs-trigger-icon",
				className,
			)}
			{...props}
		>
			{children}
		</RadixTabs.Trigger>
	);

	if (variant === "icon" && tooltipContent) {
		return <Tooltip content={tooltipContent}>{trigger}</Tooltip>;
	}

	return trigger;
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
