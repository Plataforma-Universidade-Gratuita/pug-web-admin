import type { ComponentPropsWithoutRef } from "react";

import type * as RadixSeparator from "@radix-ui/react-separator";

export interface SeparatorProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSeparator.Root>,
	"children"
> {
	orientation?: "horizontal" | "vertical";
	decorative?: boolean;
	className?: string;
}
