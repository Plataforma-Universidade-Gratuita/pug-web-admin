/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
