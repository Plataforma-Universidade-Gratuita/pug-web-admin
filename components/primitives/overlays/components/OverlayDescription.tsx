import type { ComponentType, ReactNode } from "react";

import clsx from "clsx";

import { SkeletonTextBlock } from "@/components/primitives/display/skeleton/presets";
import { useLoading } from "@/contexts";

interface OverlayDescriptionComponentProps {
	children: ReactNode;
	className?: string | undefined;
}

interface OverlayDescriptionProps {
	children: ReactNode;
	className?: string | undefined;
	DescriptionComponent: ComponentType<OverlayDescriptionComponentProps>;
	skeletonLines: string[];
}

export function OverlayDescription({
	children,
	className,
	DescriptionComponent,
	skeletonLines,
}: OverlayDescriptionProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<SkeletonTextBlock
				className={className}
				lines={skeletonLines}
			/>
		);
	}

	return (
		<DescriptionComponent className={clsx("dialog-description", className)}>
			{children}
		</DescriptionComponent>
	);
}
