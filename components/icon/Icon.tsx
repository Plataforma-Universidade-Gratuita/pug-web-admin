"use client";

import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import clsx from "clsx";

import { Skeleton } from "@/components/skeleton/Skeleton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import type { IconProps } from "@/types/client";

export function Icon({
	icon: IconComponent,
	label,
	tooltipContent,
	decorative,
	isLoading,
	size = 16,
	strokeWidth = 2,
	className,
	containerClassName,
	side = "top",
	align = "center",
	...props
}: IconProps) {
	const accessibleLabel =
		label ?? (typeof tooltipContent === "string" ? tooltipContent : undefined);
	const isDecorative = decorative ?? !accessibleLabel;
	const tooltipLabel = tooltipContent ?? accessibleLabel;

	if (isLoading) {
		return (
			<Skeleton
				className={clsx("rounded-full", containerClassName, className)}
				height={size}
				width={size}
			/>
		);
	}

	const iconNode = (
		<span
			className={clsx(
				"inline-flex shrink-0 items-center justify-center",
				containerClassName,
			)}
			{...props}
		>
			{isDecorative || !accessibleLabel ? (
				<IconComponent
					aria-hidden="true"
					className={className}
					size={size}
					strokeWidth={strokeWidth}
				/>
			) : (
				<AccessibleIcon.Root label={accessibleLabel}>
					<IconComponent
						className={className}
						size={size}
						strokeWidth={strokeWidth}
					/>
				</AccessibleIcon.Root>
			)}
		</span>
	);

	if (tooltipLabel) {
		return (
			<Tooltip
				content={tooltipLabel}
				side={side}
				align={align}
			>
				{iconNode}
			</Tooltip>
		);
	}

	return iconNode;
}
