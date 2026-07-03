/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
