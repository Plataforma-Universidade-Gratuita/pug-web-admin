/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixToggle from "@radix-ui/react-toggle";

export interface ToggleProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixToggle.Root>,
	"children"
> {
	children: ReactNode;
}
