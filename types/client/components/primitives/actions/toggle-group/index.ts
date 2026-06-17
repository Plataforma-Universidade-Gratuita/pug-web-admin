import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixToggleGroup from "@radix-ui/react-toggle-group";

export type ToggleGroupVariant = "spaced" | "pill";
export type ToggleGroupColorVariant = "default" | "chrome";

export interface ToggleGroupStyleContextValue {
	colorVariant: ToggleGroupColorVariant;
	variant: ToggleGroupVariant;
}

export type ToggleGroupProps =
	| ({
			children: ReactNode;
			variant?: ToggleGroupVariant;
			colorVariant?: ToggleGroupColorVariant;
	  } & Omit<RadixToggleGroup.ToggleGroupSingleProps, "type" | "children"> & {
				type?: "single";
			})
	| ({
			children: ReactNode;
			variant?: ToggleGroupVariant;
			colorVariant?: ToggleGroupColorVariant;
	  } & Omit<RadixToggleGroup.ToggleGroupMultipleProps, "type" | "children"> & {
				type: "multiple";
			});

export interface ToggleGroupItemProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixToggleGroup.Item>,
	"children"
> {
	children: ReactNode;
	tooltipContent?: ReactNode;
}
