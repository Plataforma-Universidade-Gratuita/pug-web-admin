"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import * as RadixSeparator from "@radix-ui/react-separator";
import clsx from "clsx";

import type { SeparatorProps } from "@/types/client";

export function Separator({
	orientation = "horizontal",
	decorative = true,
	className,
	...props
}: SeparatorProps) {
	return (
		<RadixSeparator.Root
			orientation={orientation}
			decorative={decorative}
			className={clsx(
				"separator-root",
				orientation === "horizontal"
					? "separator-horizontal"
					: "separator-vertical",
				className,
			)}
			{...props}
		/>
	);
}
