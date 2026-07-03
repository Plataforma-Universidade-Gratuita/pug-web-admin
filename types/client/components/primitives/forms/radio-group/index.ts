/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixRadioGroup from "@radix-ui/react-radio-group";

export interface RadioGroupProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
	"children"
> {
	children: ReactNode;
}

export interface RadioGroupItemProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>,
	"children"
> {
	label?: ReactNode;
	description?: ReactNode;
}
