import type { HTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"title"
> {
	children?: ReactNode;
	actions?: ReactNode;
	description: ReactNode;
	icon?: ReactNode;
	title: ReactNode;
}

export interface NoContentStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"children" | "title"
> {
	description?: ReactNode;
	title: ReactNode;
}

export interface SomeErrorStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"children" | "title"
> {
	description: ReactNode;
	onRefresh: () => void;
	title: ReactNode;
}

export interface NotFoundStateProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"children" | "title"
> {
	description?: ReactNode;
	title: ReactNode;
}
