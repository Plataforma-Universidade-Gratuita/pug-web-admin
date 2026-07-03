"use client";

/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Icon } from "@/components/primitives";
import type { SortIconProps } from "@/types/client";

export function SortIcon({ direction }: SortIconProps) {
	if (direction === "asc") {
		return (
			<Icon
				icon={ArrowUp}
				className="h-3 w-3"
				decorative
			/>
		);
	}

	if (direction === "desc") {
		return (
			<Icon
				icon={ArrowDown}
				className="h-3 w-3"
				decorative
			/>
		);
	}

	return (
		<Icon
			icon={ArrowUpDown}
			className="h-3 w-3"
			decorative
		/>
	);
}
