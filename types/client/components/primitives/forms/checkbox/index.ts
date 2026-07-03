/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type * as RadixCheckbox from "@radix-ui/react-checkbox";

export interface CheckboxProps extends Omit<
	ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
	"children"
> {
	label?: ReactNode;
	description?: ReactNode;
}
