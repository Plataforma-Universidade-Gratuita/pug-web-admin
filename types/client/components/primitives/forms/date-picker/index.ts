import type { ChangeEventHandler, InputHTMLAttributes } from "react";

import type { PopoverContentProps } from "@/types/client/components/primitives/overlays/popover/index";

export interface DatePickerProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"size" | "type" | "value" | "defaultValue" | "onChange"
> {
	value?: string;
	defaultValue?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onValueChange?: (value: string) => void;
	panelSide?: PopoverContentProps["side"];
	panelAlign?: PopoverContentProps["align"];
	panelAvoidCollisions?: PopoverContentProps["avoidCollisions"];
	panelCollisionPadding?: PopoverContentProps["collisionPadding"];
}
