"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Icon } from "@/components";
import type { SortIconProps } from "@/types";

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
