"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import * as RadixToggle from "@radix-ui/react-toggle";
import clsx from "clsx";

import type { ToggleProps } from "@/types/client";

export function Toggle({ children, className, ...props }: ToggleProps) {
	return (
		<RadixToggle.Root
			className={clsx("toggle-root", className)}
			{...props}
		>
			{children}
		</RadixToggle.Root>
	);
}
