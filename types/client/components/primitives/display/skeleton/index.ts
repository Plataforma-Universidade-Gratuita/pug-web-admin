import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
	width?: string | number;
	height?: string | number;
}

export interface SkeletonTextBlockProps {
	className?: string | undefined;
	lineClassName?: string | undefined;
	lines?: string[] | undefined;
}

export interface SkeletonActionGroupProps {
	className?: string | undefined;
}

export interface SkeletonPanelBlockProps {
	className?: string | undefined;
	heightClassName?: string | undefined;
}
