import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixToggle from "@radix-ui/react-toggle";

export interface ToggleProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixToggle.Root>,
	"children"
> {
	children: ReactNode;
}
