/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixSwitch from "@radix-ui/react-switch";

export interface SwitchProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSwitch.Root>,
	"children"
> {
	label?: ReactNode;
	description?: ReactNode;
}
