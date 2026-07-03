/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
