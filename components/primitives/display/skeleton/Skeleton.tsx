/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import clsx from "clsx";

import { normalizeSize } from "@/components/primitives/display/skeleton/utils";
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

export * from "@/components/primitives/display/skeleton/presets";
