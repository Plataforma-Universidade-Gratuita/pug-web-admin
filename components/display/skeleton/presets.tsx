import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";
import type {
	SkeletonActionGroupProps,
	SkeletonPanelBlockProps,
	SkeletonTextBlockProps,
} from "@/types/client/components/display/skeleton";

export function SkeletonTextBlock({
	className,
	lineClassName,
	lines = ["w-full", "w-[78%]"],
}: SkeletonTextBlockProps) {
	return (
		<div
			aria-hidden="true"
			className={clsx("space-y-2", className)}
		>
			{lines.map(line => (
				<Skeleton
					key={line}
					className={clsx("h-3", line, lineClassName)}
				/>
			))}
		</div>
	);
}

export function SkeletonActionGroup({ className }: SkeletonActionGroupProps) {
	return (
		<div
			aria-hidden="true"
			className={clsx("flex flex-wrap justify-end gap-3", className)}
		>
			<Skeleton className="h-10 w-24 rounded-full" />
			<Skeleton className="h-10 w-32 rounded-full" />
		</div>
	);
}

export function SkeletonPanelBlock({
	className,
	heightClassName = "h-24",
}: SkeletonPanelBlockProps) {
	return (
		<Skeleton
			aria-hidden="true"
			className={clsx(
				heightClassName,
				"rounded-[var(--twc-radius-lg)]",
				className,
			)}
		/>
	);
}
