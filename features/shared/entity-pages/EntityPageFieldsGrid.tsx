import clsx from "clsx";

import { Card, Skeleton } from "@/components";
import type {
	EntityPageFieldsGridProps,
	EntityPageFieldsGridSkeletonProps,
} from "@/types";

export function EntityPageFieldsGrid({
	fields,
	className,
}: EntityPageFieldsGridProps) {
	return (
		<div className={clsx("grid auto-rows-max gap-4 lg:grid-cols-3", className)}>
			{fields.map(field => (
				<Card
					key={field.id}
					className="grid gap-2 p-4"
				>
					<p className="ty-helper">{field.label}</p>
					<p className="ty-sm-semibold text-base break-words">{field.value}</p>
				</Card>
			))}
		</div>
	);
}

export function EntityPageFieldsGridSkeleton({
	count = 3,
	className,
}: EntityPageFieldsGridSkeletonProps) {
	return (
		<div
			aria-hidden="true"
			className={clsx("grid auto-rows-max gap-4 lg:grid-cols-3", className)}
		>
			{Array.from({ length: count }, (_, index) => (
				<Skeleton
					key={index}
					className="h-24 w-full rounded-[var(--twc-radius-xl)]"
				/>
			))}
		</div>
	);
}
