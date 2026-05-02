import clsx from "clsx";

import { Skeleton } from "@/components/display/skeleton/Skeleton";

interface SkeletonTextBlockProps {
	className?: string | undefined;
	lineClassName?: string | undefined;
	lines?: string[] | undefined;
}

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

interface SkeletonActionGroupProps {
	className?: string | undefined;
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

interface SkeletonPanelBlockProps {
	className?: string | undefined;
	heightClassName?: string | undefined;
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
