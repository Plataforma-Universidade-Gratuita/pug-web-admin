import clsx from "clsx";

import { normalizeSize } from "@/components/utils";
import type { SkeletonProps } from "@/types/client";

export function Skeleton({
	className,
	height,
	width,
	...props
}: SkeletonProps) {
	return (
		<span
			aria-hidden="true"
			className={clsx(
				"skeleton-root skeleton-shimmer",
				height ? null : "h-4",
				width ? null : "w-full",
				className,
			)}
			style={{
				height: normalizeSize(height),
				width: normalizeSize(width),
			}}
			{...props}
		/>
	);
}
