import { isValidElement } from "react";

import clsx from "clsx";

import { Card, Skeleton } from "@/components/primitives";
import type {
	EntityPageFieldsGridProps,
	EntityPageFieldsGridSkeletonProps,
} from "@/types/client";

export function EntityPageFieldsGrid({
	fields,
	className,
	columns = 3,
}: EntityPageFieldsGridProps) {
	return (
		<div
			className={clsx(
				"grid auto-rows-max gap-4",
				columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3",
				className,
			)}
		>
			{fields.map(field => (
				<Card
					key={field.id}
					className="grid min-w-0 gap-2 p-4"
				>
					<p className="ty-helper">{field.label}</p>
					{isValidElement(field.value) ? (
						<div className="ty-sm-semibold min-w-0 text-base">
							{field.value}
						</div>
					) : (
						<p className="ty-sm-semibold min-w-0 break-words text-base">
							{field.value}
						</p>
					)}
				</Card>
			))}
		</div>
	);
}

export function EntityPageFieldsGridSkeleton({
	count = 3,
	className,
	columns = 3,
}: EntityPageFieldsGridSkeletonProps) {
	return (
		<div
			aria-hidden="true"
			className={clsx(
				"grid auto-rows-max gap-4",
				columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3",
				className,
			)}
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
