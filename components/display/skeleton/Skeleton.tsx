import clsx from "clsx";

import type { SkeletonProps } from "@/types/client";

function normalizeSize(value: string | number | undefined) {
	if (typeof value === "number") {
		return `${value}px`;
	}

	return value;
}

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
				"skeleton-shimmer block rounded-full",
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
