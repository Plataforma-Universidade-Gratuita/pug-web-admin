import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixSwitch from "@radix-ui/react-switch";

export interface SwitchProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSwitch.Root>,
	"children"
> {
	label?: ReactNode;
	description?: ReactNode;
}
