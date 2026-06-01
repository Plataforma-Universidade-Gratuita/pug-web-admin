import type { ReactNode } from "react";

export interface EntityPageField {
	id: string;
	label: ReactNode;
	value: ReactNode;
}

export interface EntityPageFieldsGridProps {
	fields: EntityPageField[];
	className?: string;
	columns?: 2 | 3;
}

export interface EntityPageFieldsGridSkeletonProps {
	count?: number;
	className?: string;
	columns?: 2 | 3;
}

export interface EntityPageShellProps {
	children: ReactNode;
	description?: ReactNode;
	title: ReactNode;
}
