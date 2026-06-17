import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixScrollArea from "@radix-ui/react-scroll-area";

export interface ScrollAreaProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixScrollArea.Root>,
	"children"
> {
	children: ReactNode;
	className?: string;
	viewportClassName?: string;
}
