"use client";

import { createContext, useContext } from "react";

import * as RadixToggleGroup from "@radix-ui/react-toggle-group";
import clsx from "clsx";

import { Tooltip } from "@/components";
import type {
	ToggleGroupColorVariant,
	ToggleGroupItemProps,
	ToggleGroupProps,
	ToggleGroupVariant,
} from "@/types/client";
import type { ToggleGroupStyleContextValue } from "@/types/client/components/actions/toggle-group";

const ToggleGroupStyleContext = createContext<ToggleGroupStyleContextValue>({
	colorVariant: "default",
	variant: "spaced",
});

export function ToggleGroup(props: ToggleGroupProps) {
	if (props.type === "multiple") {
		const {
			children,
			className,
			colorVariant = "default",
			type,
			variant = "spaced",
			...multipleProps
		} = props;

		return (
			<ToggleGroupStyleContext.Provider value={{ colorVariant, variant }}>
				<RadixToggleGroup.Root
					type={type}
					className={clsx(
						"toggle-group-root",
						variant === "pill"
							? "toggle-group-variant-pill"
							: "toggle-group-variant-spaced",
						colorVariant === "chrome"
							? "toggle-group-color-chrome"
							: "toggle-group-color-default",
						className,
					)}
					{...multipleProps}
				>
					{children}
				</RadixToggleGroup.Root>
			</ToggleGroupStyleContext.Provider>
		);
	}

	const {
		children,
		className,
		colorVariant = "default",
		type,
		variant = "spaced",
		...singleProps
	} = props;

	return (
		<ToggleGroupStyleContext.Provider value={{ colorVariant, variant }}>
			<RadixToggleGroup.Root
				type={type ?? "single"}
				className={clsx(
					"toggle-group-root",
					variant === "pill"
						? "toggle-group-variant-pill"
						: "toggle-group-variant-spaced",
					colorVariant === "chrome"
						? "toggle-group-color-chrome"
						: "toggle-group-color-default",
					className,
				)}
				{...singleProps}
			>
				{children}
			</RadixToggleGroup.Root>
		</ToggleGroupStyleContext.Provider>
	);
}

export function ToggleGroupItem({
	children,
	className,
	tooltipContent,
	...props
}: ToggleGroupItemProps) {
	const { variant } = useContext(ToggleGroupStyleContext);

	const item = (
		<RadixToggleGroup.Item
			className={clsx(
				"toggle-root toggle-group-item",
				variant === "pill" && "toggle-group-item-pill",
				className,
			)}
			{...props}
		>
			{children}
		</RadixToggleGroup.Item>
	);

	if (tooltipContent) {
		return <Tooltip content={tooltipContent}>{item}</Tooltip>;
	}

	return item;
}
