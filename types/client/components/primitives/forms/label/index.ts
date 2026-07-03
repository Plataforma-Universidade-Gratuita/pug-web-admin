/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixLabel from "@radix-ui/react-label";

export interface LabelProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixLabel.Root>,
	"children"
> {
	children: ReactNode;
}
