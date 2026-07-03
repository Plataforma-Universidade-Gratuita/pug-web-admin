/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ComponentPropsWithoutRef } from "react";

import type * as RadixSeparator from "@radix-ui/react-separator";

export interface SeparatorProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixSeparator.Root>,
	"children"
> {
	orientation?: "horizontal" | "vertical";
	decorative?: boolean;
	className?: string;
}
