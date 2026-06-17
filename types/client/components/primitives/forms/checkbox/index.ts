import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixCheckbox from "@radix-ui/react-checkbox";

export interface CheckboxProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
	"children"
> {
	label?: ReactNode;
	description?: ReactNode;
}
