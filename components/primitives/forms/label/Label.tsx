"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import * as RadixLabel from "@radix-ui/react-label";
import clsx from "clsx";

import type { LabelProps } from "@/types/client";

export function Label({ children, className, ...props }: LabelProps) {
	return (
		<RadixLabel.Root
			className={clsx("label-root", className)}
			{...props}
		>
			{children}
		</RadixLabel.Root>
	);
}
