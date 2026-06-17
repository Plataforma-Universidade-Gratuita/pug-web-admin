import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixLabel from "@radix-ui/react-label";

export interface LabelProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixLabel.Root>,
	"children"
> {
	children: ReactNode;
}
