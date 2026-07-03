/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import type {
	ForwardRefExoticComponent,
	HTMLAttributes,
	ReactNode,
	RefAttributes,
} from "react";

import type { LucideProps } from "lucide-react";

export type IconComponent = ForwardRefExoticComponent<
	Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface IconProps extends Omit<
	HTMLAttributes<HTMLSpanElement>,
	"title"
> {
	icon: IconComponent;
	label?: string;
	tooltipContent?: ReactNode;
	decorative?: boolean;
	isLoading?: boolean;
	size?: number;
	strokeWidth?: number;
	containerClassName?: string;
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}
