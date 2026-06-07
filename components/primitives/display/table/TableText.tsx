"use client";

import clsx from "clsx";

import { Tooltip } from "@/components/primitives";
import type { TableTextProps } from "@/types/client";

export function TableText({
	text,
	align = "left",
	className,
	maxWidth,
	tooltiped = false,
	tooltipText,
}: TableTextProps) {
	const content = (
		<span
			className={clsx(
				"block max-w-full overflow-hidden text-ellipsis whitespace-nowrap",
				align === "center" && "mx-auto text-center",
				align === "right" && "ml-auto text-right",
				className,
			)}
			style={
				typeof maxWidth === "number"
					? {
							width: `${maxWidth}px`,
							maxWidth: `min(${maxWidth}px, 100%)`,
						}
					: undefined
			}
		>
			{text}
		</span>
	);

	if (!tooltiped) {
		return content;
	}

	return <Tooltip content={tooltipText ?? text}>{content}</Tooltip>;
}
