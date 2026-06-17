import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone =
	| "neutral"
	| "brand"
	| "success"
	| "info"
	| "warning"
	| "danger";

export type BadgeVariant = "primary" | "secondary";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	tone?: BadgeTone;
	variant?: BadgeVariant;
	onRemove?: (() => void) | undefined;
	removeLabel?: string;
}
