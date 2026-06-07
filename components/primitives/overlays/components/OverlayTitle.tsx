import type { ComponentType, ReactNode } from "react";

import clsx from "clsx";

import { Skeleton } from "@/components/primitives/display";
import { useLoading } from "@/contexts";

interface OverlayTitleComponentProps {
	children: ReactNode;
	className?: string | undefined;
}

interface OverlayTitleProps {
	children: ReactNode;
	className?: string | undefined;
	TitleComponent: ComponentType<OverlayTitleComponentProps>;
	skeletonClassName: string;
}

export function OverlayTitle({
	children,
	className,
	TitleComponent,
	skeletonClassName,
}: OverlayTitleProps) {
	const { isLoading } = useLoading();

	if (isLoading) {
		return (
			<>
				<TitleComponent className="sr-only">{children}</TitleComponent>
				<Skeleton className={clsx(skeletonClassName, className)} />
			</>
		);
	}

	return (
		<TitleComponent className={clsx("ty-header", className)}>
			{children}
		</TitleComponent>
	);
}
